import React, { CSSProperties } from 'react';
import { connect } from 'react-redux';

interface Props {
  title: string;
  keywords: string;
  description: string;
  themeStyle: CSSProperties;
  children: React.ReactNode;
}

function Layout({ title, keywords, description, themeStyle, children }: Props) {
  return (
    <html>
      <head>
        <title>{title}</title>
        <meta charSet="utf-8"></meta>
        <meta
          name="viewport"
          content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"
        ></meta>
        <meta name="keywords" content={keywords}></meta>
        <meta name="description" content={description}></meta>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        ></link>
      </head>
      <body style={{ ...themeStyle }}>
        <div id="app">{children}</div>
        <script src="https://www.gstatic.com/firebasejs/7.5.0/firebase-app.js"></script>
        <script src="/asset/js/firebase.js"></script>
      </body>
    </html>
  );
}

const mapStateToProps = ({ themeStyle }: Props) => {
  return {
    themeStyle,
  };
};

export default connect(mapStateToProps)(Layout);
