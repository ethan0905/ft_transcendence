import React, {Component} from 'react';

interface Props {
  animationDelay: number;
  active?: string;
  image?: string;
  isOnline: string;
  name: string;
}

export default class ChanItems extends Component<Props> {
  selectChat = (e: React.MouseEvent<HTMLDivElement>) => {
    for (
      let index = 0;
      index < e.currentTarget.parentNode!.children.length;
      index++
    ) {
      (e.currentTarget.parentNode!.children[index] as HTMLElement).classList.remove(
        "active"
      );
    }
    e.currentTarget.classList.add("active");
  };

  render() {
    return (
      <div
        style={{ animationDelay: `0.${this.props.animationDelay}s` }}
        onClick={this.selectChat}
        className={`chatlist__item ${
          this.props.active ? this.props.active : ""
        } `}
      >
        <div className="userMeta">
          <p>{this.props.name}</p>
        </div>
      </div>
    );
  }
}