import Workspace from '@layouts/Workspace'
import { Container, Header } from '@pages/Channel/styles';

import React from 'react'

const DirectMessage = () => {
  return (
    <Container >
    <Header>
      {/* <img src={gravater.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} /> */}
      <span>하이!!</span>
    </Header>
    </Container>
  )
}

export default DirectMessage;

