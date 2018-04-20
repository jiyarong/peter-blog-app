import { observable } from 'mobx';

class AppMobx {
  @observable
  app = {
    head_fixed: true
  }
}

export default new AppMobx()