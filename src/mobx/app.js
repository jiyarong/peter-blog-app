import { observable } from 'mobx';
import { getPostList } from '../config/api';

class AppMobx {
  @observable
  app = {
    head_fixed: true,
    recent_posts: []
  }

  constructor() {
    getPostList(1,'',10).then((result) => {
      if (result.success === true) {
        this.app.recent_posts = result.data.rows
      }
    })
  }
}

export default new AppMobx()