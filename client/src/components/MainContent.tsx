import React, { useEffect, useState } from 'react';
import { useConnectionStore } from '../store/connectionStore';
import { ConnectionService } from '../services/connection';
import { ProcessService } from '../services/process';
import { Card, Button, Space, Alert, Progress, Typography, Divider, Descriptions, Tag } from 'antd';
import {
  PlayCircleOutlined,
  StopOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const STATUS_URL = 'https://youxi.zeabur.app/api/status';
const APEX_CONFIG_URL = 'https://youxi.zeabur.app/api/config/apex';
const WS_URL = 'wss://youxi.zeabur.app/ws';

export const MainContent: React.FC = () => {
  const {
    status,
    ping,
    latency,
    serverName,
    processRunning,
    processPid,
    websocketUrl,
    lastEvent,
    setStatus,
    setError,
    reset,
    updatePing,
    updateLatency,
    setServerName,
    setProcessStatus,
    setWebsocketUrl,
    setLastEvent,
  } = useConnectionStore();

  const [config, setConfig] = useState<any | null>(null);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const connectionService = ConnectionService.getInstance();
  const processService = ProcessService.getInstance();

  const loadRemoteStatus = async () => {
    const response = await fetch(STATUS_URL);
    const payload = await response.json();
    setServerName(payload.node?.name || '香港 APEX 节点');
    setWebsocketUrl(payload.websocketUrl || WS_URL);
    setStatusLoaded(true);
  };

  const loadApexConfig = async () => {
    const response = await fetch(APEX_CONFIG_URL);
    const payload = await response.json();
    setConfig(payload);
    setWebsocketUrl(payload.connection?.websocketUrl || WS_URL);
  };

  const handleStart = async () => {
    try {
      setStatus('connecting');
      setError('');
      setLastEvent('正在连接节点');

      await connectionService.connect({
        websocketUrl,
        statusUrl: STATUS_URL
      }, {
        onPing: (value) => updatePing(value),
        onLatency: (value) => updateLatency(value),
        onStatus: (event) => setLastEvent(event),
        onConfig: (payload) => setConfig(payload),
      });

      setStatus('connected');
      setLastEvent('控制通道已连接');
      connectionService.requestStatus();
      connectionService.requestApexConfig();

      await processService.startMonitoring((process) => {
        setProcessStatus(!!process, process?.pid);
      });
    } catch (error) {
      console.error('Failed to start:', error);
      setError('启动失败，请检查节点连接');
      setStatus('error');
      await handleStop();
    }
  };

  const handleStop = async () => {
    try {
      processService.stopMonitoring();
      connectionService.disconnect();
      reset();
    } catch (error) {
      console.error('Failed to stop:', error);
      setError('停止失败');
    }
  };

  const handleRefresh = async () => {
    try {
      await loadRemoteStatus();
      await loadApexConfig();
      const process = await processService.detectGameProcess();
      setProcessStatus(!!process, process?.pid);
      setLastEvent('已刷新节点与进程状态');
    } catch (error) {
      console.error('Failed to refresh:', error);
      setError('刷新失败');
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadRemoteStatus();
        await loadApexConfig();
        const process = await processService.detectGameProcess();
        setProcessStatus(!!process, process?.pid);
      } catch (error) {
        console.error('Failed to bootstrap client:', error);
        setError('初始化失败，请检查服务端');
      }
    };

    void bootstrap();

    return () => {
      processService.stopMonitoring();
      connectionService.disconnect();
    };
  }, []);

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
              <Button size="large" onClick={handleRefresh}>
                刷新状态
              </Button>
            </Space>
          </div>

          {processRunning && (
            <Alert
              message="检测到APEX游戏正在运行"
              description={`进程已识别${processPid ? `，PID: ${processPid}` : ''}`}
              type="success"
              showIcon
            />
          )}

          {!processRunning && statusLoaded && (
            <Alert
              message="暂未检测到 APEX"
              description="请先启动 APEX，客户端会继续轮询检测 r5apex.exe"
              type="info"
              showIcon
            />
          )}

          {status === 'error' && (
            <Alert
              message="连接失败"
              description="请检查节点连接或稍后重试"
              type="error"
              showIcon
              closable
            />
          )}

          <Descriptions bordered size="small" column={1} title="当前状态">
            <Descriptions.Item label="节点">{serverName}</Descriptions.Item>
            <Descriptions.Item label="WebSocket">{websocketUrl}</Descriptions.Item>
            <Descriptions.Item label="最近状态">{lastEvent}</Descriptions.Item>
            <Descriptions.Item label="Ping">{ping ? `${ping} ms` : '未测量'}</Descriptions.Item>
            <Descriptions.Item label="延迟">{latency ? `${latency} ms` : '未测量'}</Descriptions.Item>
            <Descriptions.Item label="APEX 进程">
              {processRunning ? <Tag color="success">运行中</Tag> : <Tag>未启动</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="检测进程名">r5apex.exe</Descriptions.Item>
          </Descriptions>

          {config && (
            <Descriptions bordered size="small" column={1} title="APEX 节点配置">
              <Descriptions.Item label="游戏">{config.game?.name || 'APEX Legends'}</Descriptions.Item>
              <Descriptions.Item label="节点 IP">{config.node?.publicIp || '43.128.8.167'}</Descriptions.Item>
              <Descriptions.Item label="控制地址">{config.connection?.websocketUrl || websocketUrl}</Descriptions.Item>
              <Descriptions.Item label="健康检查">{config.connection?.healthUrl || STATUS_URL}</Descriptions.Item>
              <Descriptions.Item label="当前说明">{config.clientPlan?.zeaburOnlyLimit || 'MVP 模式'}</Descriptions.Item>
            </Descriptions>
          )}
        </Space>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical">
            <Text type="secondary">
              节点: 香港 (43.128.8.167)
            </Text>
            <Text type="secondary">
              支持游戏: APEX Legends
            </Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
};
