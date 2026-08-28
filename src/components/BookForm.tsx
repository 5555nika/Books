import { useEffect } from "react"
import { Button, Form, Input, InputNumber, Select, Space, message } from "antd"
import { BookOutlined, UndoOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import type { IBook } from "../types/types"

interface BookFormProps {
    initialValues?: IBook | null
    onSave?: (updatedBook: IBook) => void
    buttonText?: string
}

export const BookForm = ({ initialValues, onSave, buttonText = 'To Add' }: BookFormProps) => {
    const [form] = Form.useForm<IBook>()

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues)
        } else {
            form.resetFields()
        }
    }, [initialValues, form])

    const onFinish = (values: IBook) => {
        try {
            if (initialValues && onSave) {
                // Режим редактирования существующей книги
                onSave({
                    ...values,
                    id: initialValues.id,
                })
                return
            }

            // Режим создания новой книги
            const savedBooksData = localStorage.getItem('books')
            let books: IBook[] = []
            if (savedBooksData) {
                const parsed = JSON.parse(savedBooksData)
                if (Array.isArray(parsed)) books = parsed
            }

            const newBook: IBook = {
                ...values,
                id: Date.now().toString(),
            }

            const updatedBooks = [...books, newBook]
            localStorage.setItem('books', JSON.stringify(updatedBooks))

            message.success('Book successfully added!')
            form.resetFields()
        } catch (e) {
            console.error('Failed to save the book', e)
            message.error('Failed to save book')
        }
    }

    const handleReset = () => {
        form.resetFields()
    }

    const handleFillSample = () => {
        form.setFieldsValue({
            title: 'War and Peace',
            author: 'Leo Tolstoy',
            page: 1225,
            language: 'ru',
        })
    }

    return (        
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ page: 100, language: 'en' }}
        >
            <Form.Item
                name="title"
                label="Book Title"
                rules={[{ required: true, message: 'Please enter the book title!' }]}
            >
                <Input placeholder='e.g. War and Peace' />
            </Form.Item>

            <Form.Item
                name="author"
                label="Author"
                rules={[{ required: true, message: 'Please enter the author name!' }]}
            >
                <Input placeholder="e.g. Leo Tolstoy" />
            </Form.Item>

            <Form.Item
                name="page"
                label="Pages"
                rules={[{ required: true, message: 'Please specify page count!' }]}
            >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 1000" />
            </Form.Item>

            <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true, message: 'Please select a language!' }]}
            >
                <Select
                    placeholder="Select a language"
                    options={[
                        { value: 'en', label: 'English' },
                        { value: 'tr', label: 'Turkish' },
                        { value: 'ru', label: 'Russian' },
                    ]}
                />
            </Form.Item>

            <Form.Item>
                <Space wrap>
                    <Button type="primary" htmlType="submit" icon={initialValues ? <SaveOutlined /> : <BookOutlined />}>
                        {buttonText}
                    </Button>

                    {!initialValues && (
                        <>
                            <Button icon={<UndoOutlined />} onClick={handleReset}>
                                Clear
                            </Button>

                            <Button icon={<EditOutlined />} onClick={handleFillSample}>
                                Fill Sample
                            </Button>
                        </>
                    )}
                </Space>
            </Form.Item>
        </Form>
    )
}