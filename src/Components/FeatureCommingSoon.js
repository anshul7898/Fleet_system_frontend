import { Card, Typography } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ComingSoon = () => {
  return (
    <Card
      style={{
        textAlign: 'center',
        margin: '40px auto',
        maxWidth: 600,
        borderRadius: 12,
      }}
    >
      <RocketOutlined style={{ fontSize: 48, color: '#1677ff' }} />
      <Title level={3} style={{ marginTop: 20 }}>
        Feature Coming Soon
      </Title>
      <Text type="secondary">
        We're building something amazing. Stay tuned!
      </Text>
    </Card>
  );
};

export default ComingSoon;
