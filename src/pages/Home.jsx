import { useState } from 'react'
import MCT from '../assets/mc_tunes_logo.png'
import '../styles/App.css'

export default function Home() {
  return <>
        <div>
          <a href="https://github.com/kingjukster/MC_Tunes" target="_blank">
            <img src={MCT} className="logo logo-large" alt="MC Tunes logo" />
          </a>
        </div>
        <h1>MC Tunes</h1>
      </>;
}
