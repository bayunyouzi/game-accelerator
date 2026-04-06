import { Layout } from 'antd';
import { Header } from './components/Header';
import { MainContent } from './components/MainContent';
import { StatusBar } from './components/StatusBar';
import './App.css';

const { Content, Sider } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Content style={{ padding: '24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <MainContent />
          </div>
        </Content>
        <Sider width={300} style={{ background: '#fff', padding: '24px' }}>
          <StatusBar />
        </Sider>
      </Layout>
    </Layout>
  );
}

export default App;
