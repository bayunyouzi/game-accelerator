import React from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { Card, Statistic, Row, Col, Tag, Space } from 'antd';
import {
  CloudServerOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

export const StatusBar: React.FC = () => {
  const { status, latency, uploadSpeed, downloadSpeed, error } = useConnectionStore();

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircleOutlined />,
          color: 'success',
          text: '已连接',
        };
      case 'connecting':
        return {
          icon: <SyncOutlined spin />,
          color: 'processing',
          text: '连接中',
        };
      case 'error':
        return {
          icon: <ExclamationCircleOutlined />,
          color: 'error',
          text: '连接失败',
        };
      default:
        return {
          icon: <CloseCircleOutlined />,
          color: 'default',
          text: '未连接',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card title="连接状态" size="small">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Tag icon={statusConfig.icon} color={statusConfig.color}>
            {statusConfig.text}
          </Tag>
          {error && <Tag color="error">{error}</Tag>}
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="延迟"
              value={latency}
              suffix="ms"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: latency < 50 ? '#3f8600' : latency < 100 ? '#cf1322' : '#faad14' }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="服务器"
              value="香港"
              prefix={<CloudServerOutlined />}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="上传速度"
              value={uploadSpeed}
              suffix="KB/s"
              prefix={<ArrowUpOutlined />}
              precision={2}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="下载速度"
              value={downloadSpeed}
              suffix="KB/s"
              prefix={<ArrowDownOutlined />}
              precision={2}
            />
          </Col>
        </Row>
      </Space>
    </Card>
  );
};
