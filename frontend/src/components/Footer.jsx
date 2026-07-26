// === src/components/Footer.jsx ===
import { FiGithub, FiLinkedin, FiTwitter, FiHeart } from 'react-icons/fi';

export default function Footer({ hero }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-copy">
          © {year} {hero?.name || 'Portfolio'} <FiHeart size={12} className="footer-heart" />
        </p>
        <div className="footer-links">
          {hero?.socials?.github && (
            <a href={hero.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <FiGithub size={16} />
            </a>
          )}
          {hero?.socials?.linkedin && (
            <a href={hero.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FiLinkedin size={16} />
            </a>
          )}
          {hero?.socials?.twitter && (
            <a href={hero.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
              <FiTwitter size={16} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
