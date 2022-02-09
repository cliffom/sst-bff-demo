import * as sst from '@serverless-stack/resources';

export default class SNSStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create Topic
    const topic = new sst.Topic(this, 'DemoTopic', {
      subscribers: ['src/handlers/tasks/handle_demo_message.main'],
    });
  }
}
