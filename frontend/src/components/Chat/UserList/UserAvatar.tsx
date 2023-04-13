import { Component } from "react";

interface Props {
    image: string;
}

export default class UserAvatar extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <div className="avatar">
        <div className="avatar-img">
          <img src={this.props.image} alt="#" />
        </div>
      </div>
    );
  }
}