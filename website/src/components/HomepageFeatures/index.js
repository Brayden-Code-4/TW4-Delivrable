import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'What',
    description: (
      <>
        OPNsense is an open-source firewall on FreeBSD. GUI on{' '}
        <code>https://192.168.1.1/</code>, REST API under <code>/api/</code>.
        Not a Node toy API.
      </>
    ),
    to: '/docs/about',
    label: 'About OPNsense',
  },
  {
    title: 'Who',
    description: (
      <>
        Firewall admins and writers who need a lab box: two NICs, a LAN client,
        then curl with a key and a secret.
      </>
    ),
    to: '/docs/developer/overview',
    label: 'Developer guide',
  },
  {
    title: 'Why docs',
    description: (
      <>
        Installer user vs root, no official Docker image, Basic auth on the API.
        Those three facts fail on a first ISO if nobody wrote them down.
      </>
    ),
    to: '/docs/api/overview',
    label: 'API reference',
  },
];

function Feature({title, description, to, label}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.card}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link to={to}>{label}</Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
