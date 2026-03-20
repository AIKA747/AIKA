class SingleItem {
  static instance: any;
  static runOnce: any;
  show(fn: () => void) {
    // fn的只调用1次，这是实现modal弹框不重复的要点
    if (!SingleItem.runOnce) {
      SingleItem.runOnce = 1;
      fn();
    }
  }
  static getInstance() {
    return SingleItem.instance || (SingleItem.instance = new SingleItem()); //这里是否单例没关系
  }
}

export { SingleItem };
