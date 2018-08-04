import React from "react";
import Aux from "../hoc/Wrap";
import { NavLink } from "react-router-dom";

const About = props => {
  return (
    <Aux>
      <header>
        <NavLink to="/" exact>
          <img
            id="logo"
            src="assets/logo-beta.jpg"
            alt="Kid Safe Videos Logo"
          />
        </NavLink>
        <nav>
          <NavLink to="/manage-channels">Channels</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <article class="about">
        <h1>Why we built this website</h1>
        <p>
          This website was developed to help caregivers feel confident and
          secure about the videos children under their care are watching.
          <br />
          <br />
          Steps to use:
          <ol>
            <li>Search for the channels you approve</li>
            <li>Add them to the channel section</li>
            <li> Choose a playlist or video to watch</li>
          </ol>
          The channels that get returned in the search are filtered with
          YouTube's
          <a
            href="https://support.google.com/youtube/answer/7354993?hl=en"
            target="_blank"
          >
            Restricted Mode
          </a>
          ('strict' policy). We, ourselves, do not rate or filter
          channels/videos. The website will only play the videos from a chosen
          playlist and will not automatically advance to a different
          channel/playlist. This ensures that the viewer will not have access to
          'related' or 'suggested' videos presented by YouTube.
        </p>

        <p>
          The channels you selected are saved in your browser's memory, so when
          you re-open the browser the channels will still be there.
        </p>
        <p>
          For suggestions/questions/feedback please email us at{" "}
          <a href="mailto:info@kidsafevideos.com">info@kidsafevideos.com</a>
        </p>
      </article>
    </Aux>
  );
};

export default About;
