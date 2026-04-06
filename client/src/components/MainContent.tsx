import React, { useState } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { ProxyService } from '../services/proxy';
import { ConnectionService } from '../services/connection';
import { ProcessService } from '../services/process';
import { Card, Button, Space, Alert, Progress, Typography, Divider } from 'antd';
import {
  PlayCircleOutlined,
  StopOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export const MainContent: React.FC = () => {
  const { status, setStatus, setError, reset } = useConnectionStore();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [gameDetected, setGameDetected] = useState(false);

  const proxyService = ProxyService.getInstance();
  const connectionService = ConnectionService.getInstance();
  const processService = ProcessService.getInstance();

  const handleStart = async () => {
    try {
      setStatus('connecting');
      setError('');

      // 配置系统代理
      await proxyService.setProxy('127.0.0.1', 7890);

      // 连接到服务器
      await connectionService.connect({
        host: '43.128.8.167',
        port: 7890,
        protocol: 'tcp'
      });

      setStatus('connected');

      // 开始监控游戏进程
      setIsMonitoring(true);
      await processService.startMonitoring((process) => {
        setGameDetected(process !== null);
      });

    } catch (error) {
      console.error('Failed to start:', error);
      setError('启动失败，请检查网络连接');
      setStatus('error');
      await handleStop();
    }
  };

  const handleStop = async () => {
    try {
      setIsMonitoring(false);

      // 断开连接
      connectionService.disconnect();

      // 清除系统代理
      await proxyService.clearProxy();

      reset();
      setGameDetected(false);
    } catch (error) {
      console.error('Failed to stop:', error);
      setError('停止失败');
    }
  };

  const getProgressStatus = () => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'active';
      case 'error':
        return 'exception';
      default:
        return 'normal';
    }
  };

  const getProgressPercent = () => {
    switch (status) {
      case 'connected':
        return 100;
      case 'connecting':
        return 50;
      case 'error':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>
            <RocketOutlined /> 游戏加速器
          </Title>
          <Text type="secondary">一键启动，畅快游戏</Text>
        </div>

        <Divider />

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ textAlign: 'center' }}>
            {status === 'connected' && (
              <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            )}
            {status === 'connecting' && (
              <LoadingOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            )}
            {status === 'error' && (
              <StopOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
            )}
            {status === 'disconnected' && (
              <PlayCircleOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />
            )}
          </div>

          <Progress
            percent={getProgressPercent()}
            status={getProgressStatus()}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />

          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStart}
                disabled={status === 'connected' || status === 'connecting'}
                loading={status === 'connecting'}
              >
                一键启动
              </Button>
              <Button
                size="large"
                icon={<StopOutlined />}
                onClick={handleStop}
                disabled={status === 'disconnected'}
              >
                停止加速
              </Button>
            </Space>
          </div>

          {gameDetected && (
            <Alert
              message="检测到APEX游戏正在运行"
              description="游戏流量已自动加速"
              type="success"
              showIcon
            />
          )}

          {status === 'error' && (
            <Alert
              message="连接失败"
              description="请检查网络连接或联系管理员"
              type="error"
              showIcon
              closable
            />
          )}
        </Space>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical">
            <Text type="secondary">
              服务器: 香港 (43.128.8.167:7890)
            </Text>
            <Text type="secondary">
              支持游戏: APEX
            </Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
};
