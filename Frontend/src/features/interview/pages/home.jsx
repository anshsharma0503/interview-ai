import React from 'react'
import "../style/home.scss"

const Home = () => {
  return (
    <main className= 'home'>
        <div className="left">
            <textarea name="jobDescription" id="jobDescription" placeholder='Enter Job Description here..'></textarea>
        </div>
        <div className="right">
            <div className="input-group">
                <label htmlFor="resume">Upload Resume</label>
                <input type="file" name="resume" id="resume" />
            </div>
            <div className="input-group">
                <label htmlFor="selfDescription">Self Description</label>
                <textarea name="selfDescription" id="selfDescription" placeholder='Enter Self Description here..'></textarea>
            </div>
            <button className='generate-btn'>Generate Interview</button>
        </div>
    </main>
  )
}

export default Home;