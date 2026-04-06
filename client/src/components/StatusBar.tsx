import React from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { Card, Statistic, Row, Col, Tag, Space } from 'antd';
import {
  CloudServerOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

export const StatusBar: React.FC = () => {
  const { status, ping, latency, serverName, processRunning, lastEvent, error } = useConnectionStore();

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
              title="Ping"
              value={ping}
              suffix="ms"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: ping < 50 ? '#3f8600' : ping < 100 ? '#1677ff' : '#faad14' }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="节点"
              value={serverName}
              prefix={<CloudServerOutlined />}
            />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="延迟"
              value={latency}
              suffix="ms"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: latency < 80 ? '#3f8600' : latency < 150 ? '#1677ff' : '#fa541c' }}
            />
          </Col>
          <Col span={12}>
            <Space direction="vertical" size={4}>
              <Tag color={processRunning ? 'success' : 'default'}>
                {processRunning ? 'APEX 运行中' : 'APEX 未启动'}
              </Tag>
              <Tag color="blue">{lastEvent}</Tag>
            </Space>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};
