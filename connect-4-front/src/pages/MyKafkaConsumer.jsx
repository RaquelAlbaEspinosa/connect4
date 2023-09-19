import React from 'react';
import KafkaConsumer from 'react-kafka-consumer';

class MyKafkaConsumer extends React.Component {
  handleMessage = (message) => {
    console.log(`Mensaje Kafka recibido: ${message}`);
  }

  render() {
    return (
      <KafkaConsumer
        topic="mi-topico"
        groupId="mi-grupo"
        onMessage={this.handleMessage}
      />
    );
  }
}

export default MyKafkaConsumer;
