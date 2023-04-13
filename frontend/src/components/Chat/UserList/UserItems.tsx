import React, { useState, useEffect, useRef,  Component} from 'react';
import UserAvatar from "./UserAvatar";
import "./UserList.css";


type DropdownOption = {
  label: string;
  value: string;
};

const dropdownOptions: DropdownOption[] = [
  { label: 'Kick', value: 'kick' },
  { label: 'Ban', value: 'ban' },
  { label: 'Mute', value: 'mute' },
];

const KickBanMuteButton: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setShowDropdown(false);
    // Call to action (kick, ban or mute)

  };

  return (
    <div>
      <button  className="fa fa-ellipsis-h" onClick={handleButtonClick}></button>
      {showDropdown && (
        <ul>
          {dropdownOptions.map((option) => (
            <li key={option.value} 
            onMouseEnter={() => setSelectedOption(option)}
            onMouseLeave={() => setSelectedOption(null)}
            onClick={() => handleOptionSelect(option)} 
            style={{ backgroundColor: selectedOption === option ? 'gray' : 'white', color: 'black' }}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


interface Props {
  animationDelay: number;
  active?: string;
  image?: string;
  isOnline: string;
  name: string;
}

export default class UserItems extends Component<Props> {
    selectChat = (e: React.MouseEvent<HTMLDivElement>) => {
      for (
        let index = 0;
        index < e.currentTarget.parentNode!.children.length;
        index++
      ) {
        (e.currentTarget.parentNode!.children[index] as HTMLElement).classList.remove("active");
      }
      e.currentTarget.classList.add("active");
    };
  
    render() {
      return (
        <div
          style={{ animationDelay: `0.${this.props.animationDelay}s` }}
          onClick={this.selectChat}
          className={`userlist__item ${ this.props.active ? this.props.active : "" } `}
        >
          <div className='id_user'>
            <UserAvatar
              image={this.props.image ? this.props.image : "http://placehold.it/80x80"}/>
    
            <div className="userMeta">
              <p>{this.props.name}</p>
            </div>
          </div>
          

          <KickBanMuteButton/>
        </div>
      );
    }
  }