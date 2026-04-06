import React from 'react';
import { RocketOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header: React.FC = () => {
  return (
    <AntHeader style={{
      display: 'flex',
      alignItems: 'center',
      background: '#001529',
      padding: '0 24px',
    }}>
      <RocketOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
      <Title level={3} style={{ margin: 0, color: '#fff' }}>
        APEX 游戏加速器 MVP
      </Title>
    </AntHeader>
  );
};
