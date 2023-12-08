import React from "react";
import styled from "styled-components";

const LandingContainer = styled.div`
display: flex;
flex-direction: column;
border-radius: 10px;
border: solid 4px #f79817;
align-items: center;
justify-content: center;
background-color: #000000;
width: 678px;
max-width: 100%;
min-height: 400px;
position: relative; /* Make the container a positioning context */
overflow: hidden; /* Hide overflow to ensure the image is contained within the container */
background-image: url('/images/bg1.jpg'); /* Replace with the path to your image */
background-size: cover; /* Ensures the image covers the entire container */
background-position: center; /* Centers the image */
`;

const Title = styled.h1`
  font-weight: bold;
  color: #f79817;
  margin: 0;
`;

const Paragraph = styled.p`
  color:#fff;
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0;
  text-align: center;
  width: 60%;
`;

const GetStartedButton = styled.button`
  border-radius: 20px;
  border: 1px solid #e67315;
  background-color: #e67315;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
`

const StyledImage = styled.img`
  position: absolute; // Position the image absolutely within the container
  top: 0; // Align to the top
  left: -40px; // Align to the left
  width: 35%; // Set the width to 100% to make it responsive
  max-height: 70px; // Set the maximum height if needed
  object-fit: cover; // Maintain the aspect ratio while covering the container
`;


const LandingPage = () => {
  return (
    <LandingContainer>
      <StyledImage src="/images/VAR.png" alt="Your Alt Text Here" />
      <Title>Welcome to Zen-Filter</Title>
      <Paragraph>
      In our digital age, where young users navigate the online world, Zen-Filter is your ally in creating a secure internet space. Our smart system uses advanced technology to identify and block explicit and violent content in real-time, ensuring a safe online experience for users under 18. Empowering parents, Zen-Filter provides easy control over their children's online activities while promoting exploration and learning.
      </Paragraph>
      <GetStartedButton>Get Started</GetStartedButton>
    </LandingContainer>
  );
};

export default LandingPage;

