import { AppRouter } from "./components/AppRouter"
import { Navbar } from "./components/Navbar"
import { Layout } from "antd"


export const App = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Layout.Header style={{ padding: '0', height: 'auto', lineHeight: 'normal'}}>
        <Navbar />
      </Layout.Header>
      <Layout.Content  style={{ padding: '20px' }}>
        <AppRouter />
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
        Book App ©2026
      </Layout.Footer>
    </Layout>
  )
}