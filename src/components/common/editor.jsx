import * as React from 'react';
import { milkFileReader } from 'react-milkdown';
import { updateAliyunOss } from '../../config/api';
import 'font-awesome/css/font-awesome.min.css';


let blobReader = file => (
  new Promise(async (res, rej) => {
    let url = await updateAliyunOss(file)
    res(url);
  })
);

const Milk = milkFileReader(blobReader);

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false
    }
  }

  static defaultProps = {
    value: '',
    onChange: () => { },
    style: { margin: "0 auto", width: '100%' }
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({ refresh: true })
    // setTimeout(() => {
    //   this.setState({ refresh: false })
    // }, 50)
  }

  render() {
    const { value, onChange, style } = this.props
    if (this.state.refresh === true) {
      return <div></div>
    } else {
      return (
        <Milk
          value={value}
          onChange={onChange}
          style={style}
        />
      )
    }
  }
}

export default Editor