/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

function Services () {
    let message = `"Did our best to provide a powerful tool in the hands of parents to control and manage /n the activities of their children"`;
    return (
      <section class="section-white">
 
    <div class="container">
 
        <div class="row">
       
                    <div class="col-md-12 text-center">

                          <h2 class="section-title">The Team Behind Zen-Filter</h2>

                          <p class="section-subtitle">{message}</p>
                          
                    </div> 
             
            <div class="col-sm-6 col-md-4">

                  <div class="team-item">
                  
                      <img src="./images/haseeb.jpg" class="team-img" alt="pic" />                   
                      <h3>HASEEB MUSHTAQ</h3>            
                      <div class="team-info"><p>ML Expert</p></div>
                      <p>Haseeb, an accomplished ML expert, excels in leveraging cutting-edge algorithms to unlock the true potential of machine learning for transformative solutions.</p>
                
                </div>
            </div> 
              
            <div class="col-sm-6 col-md-4">

                  <div class="team-item">
                  
                      <img src="./images/subhan.jpg" class="team-img" alt="pic" height={140} width={150} />
                     
                      <h3>SUBHAN ATTIQUE</h3>
                      
                      <div class="team-info"><p>React js Developer</p></div>

                      <p>Subhan, a skilled ReactJS developer, brings creativity and efficiency to every project, ensuring seamless user experiences through his mastery in front-end development.</p>
                                      
                  </div>

            </div> 
            <div class="col-sm-6 col-md-4">

                  <div class="team-item">
                  
                      <img src="./images/mohsin.jpg" class="team-img" alt="pic" />
                     
                      <h3>MOHSIN SHAHID</h3>
                      
                      <div class="team-info"><p>Flutter Developer</p></div>

                      <p>In the realm of Flutter development, Mohsin's ingenuity shines bright, translating ideas into fluid and feature-rich mobile experiences that captivate users in a positive manner</p>
                                        
                  </div>

            </div> 
        
        </div> 
    
    </div> 

    </section>
    )
}

export default Services;