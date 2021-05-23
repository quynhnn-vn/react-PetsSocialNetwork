import React from 'react';
import { fetchUserData, cancelFetch } from './dataFetcher';
import { Userlist } from './Userlist';

export class Profile extends React.Component {
  // Create a constructor for the Profile component
  // this.state represents a profile with no user data loaded.
  constructor(props) {
    super(props);
    this.state = {userData: null};
  }

  // Load user data into the component's state
  loadUserData() {
    this.setState({ userData: null });
    this.fetchID = fetchUserData(this.props.username, (userData) => {
      this.setState({ userData });
    });
  }

  // Lifecycle method for when the component mounts
  componentDidMount() {
    this.loadUserData();
  }

  // Lifecycle method for when the component unmounts
  componentWillUnmount() {
    cancelFetch(this.fetchID);
  }

  // Lifecycle method for when the component updates
  componentDidUpdate(prevProps) {
    if(this.props.username !== prevProps.username) {
      cancelFetch(this.fetchID);
      this.loadUserData();
    }
  }

  render() {
    const isLoading = this.state.userData === null;
    // Update the user’s profile picture
    const image = (<img src={!isLoading && this.state.userData.profilePictureUrl} alt="" />)
    // Update the user's name, bio and friends array
    let name, bio, friends;
    if (isLoading) {
      name = 'Loading name...';
      bio = 'Loading bio...';
      friends = [];
    } else {
      name = this.state.userData.name;
      bio = this.state.userData.bio;
      friends = this.state.userData.friends;
    }
    let className = 'Profile';
    if (isLoading) {
      className += ' loading';
    }

    return (
      <div className={className}>
        <div className="profile-picture">{image}</div>
        <div className="profile-body">
          <h2>{name}</h2>
          <h3>@{this.props.username}</h3>
          <p>{bio}</p>
          <h3>Friends</h3>
          <Userlist usernames={friends} onChoose={this.props.onChoose} />
        </div>
      </div>
    );
  }
}