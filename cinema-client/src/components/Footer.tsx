import styles from "./Footer.module.css";

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <div className={styles.column}>
        <h4>CinemaX</h4>
        <p>
          Your destination for the latest movies, exclusive premieres, and unforgettable experiences. Enjoy the magic of cinema with us!
        </p>
      </div>
      <div className={styles.column}>
        <h5>Contact Us</h5>
        <ul>
          <li>Email: support@cinemax.com</li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>123 Movie Lane, Film City, CA</li>
        </ul>
      </div>
      <div className={styles.column}>
        <h5>Quick Links</h5>
        <ul>
          <li><a href="/movies">Now Showing</a></li>
          <li><a href="/bookings">My Bookings</a></li>
          <li><a href="/about">About Us</a></li>
        </ul>
      </div>
      <div className={styles.column}>
        <h5>Follow Us</h5>
        <div className={styles.socials}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |{" "}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> |{" "}
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </div>
    </div>
    <div className={styles.copyright}>
      &copy; {new Date().getFullYear()} CinemaX. All rights reserved.
    </div>
  </footer>
);

export default Footer;