import styled from 'styled-components';
import Game from './Game/Game';

function App() {
  return (
    <Wrapper>
      <Game></Game>
    </Wrapper>

  );
}

export default App;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
`;
