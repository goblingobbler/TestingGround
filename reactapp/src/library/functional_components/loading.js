import React, { Component } from 'react';

export default class Loading extends Component {
    render() {
        //Should get parent height
        let height = '100%';
        if (this.props.full_height) {
            height = `${window.innerHeight}px`;
        }

        let loading_image = (
            <div>
                <div
                    className="spinner-grow text-info"
                    role="status"
                    style={{ margin: '10px' }}
                >
                    <span className="sr-only">Loading...</span>
                </div>

                <div
                    className="spinner-grow text-info"
                    role="status"
                    style={{
                        animationDelay: '150ms',
                        margin: '10px',
                    }}
                >
                    <span className="sr-only">Loading...</span>
                </div>

                <div
                    className="spinner-grow text-info"
                    role="status"
                    style={{
                        animationDelay: '300ms',
                        margin: '10px',
                    }}
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );

        if (this.props.loaded) {
            return <div>{this.props.children}</div>;
        } else if (this.props.cover) {
            return (
                <div>
                    {this.props.children}
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: height,
                            textAlign: 'center',
                            zIndex: '10',
                            background: 'rgba(245,245,245,.2)',

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {loading_image}
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: height,
                        textAlign: 'center',
                        padding: '10%',
                        zIndex: '10',
                        background: '#f5f5f5',
                    }}
                >
                    {loading_image}
                </div>
            );
        }
    }
}
