import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
background-color: #fff;
border: 4px solid #F79817;
box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
border-radius: 10px;
position: relative;
overflow: hidden;
width: 678px;
max-width: 100%;
min-height: 400px;
`;

export const SignUpContainer = styled.div`
 position: absolute;
 top: 0;
 height: 100%;
 transition: all 0.6s ease-in-out;
 left: 0;
 width: 50%;
 opacity: 0;
 z-index: 1;
 ${props => props.signinIn !== true ? `
   transform: translateX(100%);
   opacity: 1;
   z-index: 5;
 ` 
 : null}
`;


export const SignInContainer = styled.div`
position: absolute;
top: 0;
height: 100%;
transition: all 0.6s ease-in-out;
left: 0;
width: 50%;
z-index: 2;
${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;

export const Form = styled.form`
background-color: #fff;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 0 50px;
height: 100%;
text-align: center;
`;

export const Title = styled.h1`
font-weight: bold;
color: #f79817;
margin: 0;
`;

export const Title1 = styled.h1`
font-weight: bold;
text-align: center;
margin: 0;
`;

export const Input = styled.input`
background-color: #eee;
border: none;
border-radius: 64px;
padding: 12px 15px;
margin: 8px 0;
width: 100%;
`;


export const Button = styled.button`
   border-radius: 20px;
   border: 1px solid #e67315;
   background-color: #e67315;
   color: #ffffff;
   font-size: 12px;
   font-weight: bold;
   padding: 12px 45px;
   letter-spacing: 1px;
   text-transform: uppercase;
   transition: transform 80ms ease-in;
   &:active{
       transform: scale(0.95);
   }
   &:focus {
       outline: none;
   }
`;
export const GhostButton = styled(Button)`
background-color: transparent;
border-color: #ffffff;
`;

export const Anchor = styled.a`
color: #F79817;
font-size: 14px;
text-decoration: none;
margin: 15px 0;
`;
export const OverlayContainer = styled.div`
position: absolute;
top: 0;
left: 50%;
width: 50%;
height: 100%;
overflow: hidden;
transition: transform 0.6s ease-in-out;
z-index: 100;
${props =>
 props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
background: #F79817;
background: -webkit-linear-gradient(to right, #F79817, #F79817);
background: linear-gradient(to right, #F79817, #F79817);
background-repeat: no-repeat;
background-size: cover;
background-position: 0 0;
color: #ffffff;
position: relative;
left: -100%;
height: 100%;
width: 200%;
transform: translateX(0);
transition: transform 0.6s ease-in-out;
${props => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
`;

export const OverlayPanel = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  text-algin: center;
  ${props => props.signinIn !== true ? `transform: translateX(0);` : null}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
    right: 0;
    transform: translateX(0);
    text-algin: center;
    ${props => props.signinIn !== true ? `transform: translateX(20%);` : null}
`;

export const Paragraph = styled.p`
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 40px 2000px ;
    text-align: center; /* Corrected the property name */
    width:100%;
`;

export const StyledImage = styled.img`
  position: absolute; // Position the image absolutely within the container
  top: -8px; // Align to the top
  left: -15px; // Align to the left
  width: 35%; // Set the width to 100% to make it responsive
  max-height: 70px; // Set the maximum height if needed
  object-fit: cover; // Maintain the aspect ratio while covering the container
`;
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Container with fade-in and fade-out animation based on the state
export const AnimatedContainer = styled.div`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 0.5s ease-in-out;
`;


