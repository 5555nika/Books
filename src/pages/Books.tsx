import { Typography, Row, Col, Card } from "antd"
import { BookForm } from "../components/BookForm"

const { Title } = Typography

export const Books = () => {


    return (
        <Row justify="center" style={{ marginTop: 24, padding: '0 16px', marginBottom: 24 }}>
            <Col xs={24} sm={22} md={14} lg={10}>
                <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Title level={2} style={{ marginBottom: 20 }}>Add New Book</Title>
                    <BookForm />
                </Card>
            </Col>
        </Row>
    )
}