/**
 * Email Sift Web2. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';

const domUtils = {
  clearChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    // Listens for 'count' events from the Controller
    this.controller.subscribe('dataUpdate', this.onDataUpdate.bind(this));
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftview
  presentView(value) {
    console.log('email-sift-web: presentView: ', value);
    this.onDataUpdate(value.data);
  }

  willPresentView(value) {
    console.log('email-sift-web: willPresentView: ', value);
  }

  onDataUpdate(data) {
    console.log('email-sift-web: onDataUpdate: ', data);
    if (data.counts) {
      Object.keys(data.counts).filter(key => ['messageTotal', 'wordTotal', 'wpmTotal'].includes(key)).forEach((k) => {
        document.getElementById(k).textContent = data.counts[k];
      });
    }

    if (data.messages && data.messages.length > 0) {
      const messages = data.messages.slice(0, 50);
      const messageList = document.getElementById('messageList');
      domUtils.clearChildren(messageList);

      document.getElementById('messagesContainer').style.display = 'unset';

      const messageItemNodes = messages.map(({ subject, wordCount }) => {
        const liNode = document.createElement('li');
        liNode.style = 'display: flex; margin-top: 16px; margin-bottom: 16px; padding: 16px; border-bottom: 1px solid #e0e0e0; flex-direction: column;'

        const subjectNode = document.createElement('h4');
        subjectNode.style = 'text-align: left;';

        const wordCountNode = document.createElement('p');
        wordCountNode.textContent = `Email word count: ${wordCount}`;
        subjectNode.textContent = subject;

        liNode.appendChild(subjectNode);
        liNode.appendChild(wordCountNode);

        return liNode;
      })

      messageItemNodes.forEach(node => messageList.appendChild(node));
    } else {
      document.getElementById('messagesContainer').style.display = 'none';
    }
  }
}

registerSiftView(new MyView(window));
