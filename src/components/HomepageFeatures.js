import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import styles from './HomepageFeatures.module.css';


const FeatureList = [
  {
    title: '多代理会话框架',
    Svg: require('../../static/img/conv_2.svg').default,
    docLink: './docs/Use-Cases/agent_chat',
    description: (
      <>
        AutoGen提供多代理会话框架作为高级抽象。利用这个框架，可以方便地构建LLM工作流程。
      </>
    ),
  },
  {
    title: '轻松构建多样化应用程序',
    Svg: require('../../static/img/autogen_app.svg').default,
    docLink: './docs/Use-Cases/agent_chat#diverse-applications-implemented-with-autogen',
    description: (
      <>
        AutoGen提供了一个涵盖各种领域和复杂性的广泛应用程序的工作系统集合。
      </>
    ),
  },
  {
    title: '增强的LLM推理与优化',
    Svg: require('../../static/img/extend.svg').default,
    docLink: './docs/Use-Cases/enhanced_inference',
    description: (
      <>
      AutoGen支持增强的LLM推理API，这些API可以用来提高推理性能和降低成本。
      </>
    ),
  },
];


function Feature({Svg, title, description, docLink}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Link to={docLink}>
            <h3>{title}</h3>
        </Link>
        <p>{description}</p>
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
