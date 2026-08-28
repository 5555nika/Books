import { useEffect, useState, useMemo } from 'react'
import { Table, Button, Popconfirm, Tag, Typography, Row, Col, message, Card, Space, Modal, Input, Statistic } from 'antd'
import { DeleteOutlined, EditOutlined, BookOutlined, FileTextOutlined, GlobalOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { IBook } from '../types/types'
import { BookForm } from '../components/BookForm'

const { Title } = Typography
const { Search } = Input

export const BookList = () => {
    const [books, setBooks] = useState<IBook[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [editForm, setEditForm] = useState<IBook | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')

    // 1. При загрузке страницы читаем список книг из localStorage
    const loadBooks = () => {
        setLoading(true)
        try {
            const savedData = localStorage.getItem('books')
            if (savedData) {
                const parsed = JSON.parse(savedData)
                if (Array.isArray(parsed)) {
                    setBooks(parsed)
                    return
                }
            }
            setBooks([])
        } catch (e) {
            console.error('Failed to load books', e)
            setBooks([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadBooks()
    }, [])

    // 2. Функция удаления книги по id
    const handleDelete = (id?: string) => {
        if (!id) return
        try {
            const updatedBooks = books.filter((b) => b.id !== id)
            setBooks(updatedBooks)
            localStorage.setItem('books', JSON.stringify(updatedBooks))
            message.success('Book successfully deleted!')
        } catch (e) {
            console.error('Failed to delete the book:', e)
            message.error('Failed to delete the book')
        }
    }

    // 3. Открытие модального окна для редактирования
    const handleOpenEdit = (book: IBook) => {
        setEditForm(book)
    }

    // 4. Сохранение отредактированной книги
    const handleSaveEdit = (updatedBook: IBook) => {
        try {
            const updatedBooks = books.map((item) =>
                item.id === updatedBook.id ? updatedBook : item
            )
            setBooks(updatedBooks)
            localStorage.setItem('books', JSON.stringify(updatedBooks))
            setEditForm(null)
            message.success('Book successfully updated!')
        } catch (e) {
            console.error('Failed to update the book:', e)
            message.error('Failed to update book')
        }
    }

    // 5. Экспорт списка книг в JSON-файл
    const handleExportData = () => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(books, null, 2))
            const downloadAnchor = document.createElement('a')
            downloadAnchor.setAttribute("href", dataStr)
            downloadAnchor.setAttribute("download", `my_books_${new Date().toISOString().slice(0, 10)}.json`)
            document.body.appendChild(downloadAnchor)
            downloadAnchor.click()
            downloadAnchor.remove()
            message.success('Books successfully exported!')
        } catch (e) {
            console.error('Export failed:', e)
            message.error('Failed to export books')
        }
    }
    const filteredBooks = useMemo(() => {
        if (!searchQuery.trim()) return books
        const query = searchQuery.toLowerCase().trim()
        return books.filter(
            (b) =>
                b.title.toLowerCase().includes(query) ||
                b.author.toLowerCase().includes(query)
        )
    }, [books, searchQuery])

    // 6. Подсчет статистики в реальном времени
    const totalPages = useMemo(() => {
        return books.reduce((acc, b) => acc + (Number(b.page) || 0), 0)
    }, [books])

    const uniqueLanguages = useMemo(() => {
        return new Set(books.map((b) => b.language)).size
    }, [books])

    // 7. Колонки таблицы Ant Design с сортировкой и фильтрами
    const columns: ColumnsType<IBook> = [
        {
            title: 'Book Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },  
        {  
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            sorter: (a, b) => a.author.localeCompare(b.author),
        },  
        {  
            title: 'Pages',
            dataIndex: 'page',
            key: 'page',
            sorter: (a, b) => (Number(a.page) || 0) - (Number(b.page) || 0),
        },
        {
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
            filters: [
                { text: 'English', value: 'en' },
                { text: 'Turkish', value: 'tr' },
                { text: 'Russian', value: 'ru' },
            ],
            onFilter: (value, record) => record.language === value,
            render: (language: string) => {
                let color = 'blue' 
                let text = 'English'
                if (language === 'tr') { color = 'volcano'; text = 'Turkish' }
                if (language === 'ru') { color = 'green'; text = 'Russian' }
                return <Tag color={color}>{text.toUpperCase()}</Tag>
            },
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 110,
            render: (_, record) => ( 
                <Space size="small">
                    <Button 
                        type="text" 
                        onClick={() => handleOpenEdit(record)} 
                        icon={<EditOutlined style={{ color: '#1890ff', fontSize: '16px' }} />} 
                    />
                    <Popconfirm
                        title="Delete Book"
                        description="Are you sure you want to delete this book?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <Button danger type="text" icon={<DeleteOutlined style={{ fontSize: '16px' }} />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <Row justify="center" style={{ marginTop: 24, padding: '0 16px', marginBottom: 24 }}>
            <Col xs={24} sm={22} md={20} lg={18}>
                
                {/* БЛОК СТАТИСТИКИ */}
                <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                    <Col xs={24} sm={8}>
                        <Card hoverable style={{ borderRadius: 10 }}>
                            <Statistic 
                                title="Total Books" 
                                value={books.length} 
                                prefix={<BookOutlined style={{ color: '#1890ff' }} />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card hoverable style={{ borderRadius: 10 }}>
                            <Statistic 
                                title="Total Pages" 
                                value={totalPages} 
                                prefix={<FileTextOutlined style={{ color: '#52c41a' }} />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card hoverable style={{ borderRadius: 10 }}>
                            <Statistic 
                                title="Languages" 
                                value={uniqueLanguages} 
                                prefix={<GlobalOutlined style={{ color: '#722ed1' }} />} 
                            />
                        </Card>
                    </Col>
                </Row>

                {/* ГЛАВНАЯ КАРТОЧКА С ПОИСКОМ И ТАБЛИЦЕЙ */}
                <Card 
                    hoverable 
                    style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                >
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
                        My Saved Books
                    </Title>
                    
                    {/* Строка живого поиска и кнопка Экспорта */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                        <Col flex="auto">
                            <Search
                                placeholder="Search books by title or author..."
                                allowClear
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                size="large"
                            />
                        </Col>
                        <Col>
                            <Button 
                                size="large" 
                                icon={<FileTextOutlined />} 
                                onClick={handleExportData}
                                disabled={books.length === 0}
                            >
                                Export JSON
                            </Button>
                        </Col>
                    </Row>

                    <Table<IBook>
                        columns={columns}
                        dataSource={filteredBooks}
                        loading={loading}
                        rowKey={(record, index) => record.id || `book-${index}`}
                        pagination={{ pageSize: 5 }}
                        locale={{ emptyText: 'No books found' }}
                        scroll={{ x: 'max-content' }}
                    />
                </Card>

                {/* Модальное окно редактирования */}
                <Modal
                    title="Edit Book"
                    open={!!editForm}
                    onCancel={() => setEditForm(null)}
                    footer={null}
                    destroyOnClose
                >
                    {editForm && (
                        <BookForm 
                            initialValues={editForm} 
                            onSave={handleSaveEdit} 
                            buttonText="Save Changes" 
                        />
                    )}
                </Modal>
            </Col>
        </Row>
    )
}