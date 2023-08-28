import styled from 'styled-components';
import AppHome from './Game/AppHome';

function App() {
  return (
    <Wrapper>
      <AppHome></AppHome>
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
