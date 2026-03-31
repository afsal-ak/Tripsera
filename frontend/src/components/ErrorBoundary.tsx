import React, { Component, type ReactNode } from 'react';
import { Plane } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleGoBack = () => {
        this.setState({ hasError: false }); // 👈 reset first
        window.history.back();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 px-4 text-center">

                    {/* Icon */}
                    <Plane className="text-orange-400 mb-4" size={40} />

                    {/* Title */}
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                        Oops! Something went wrong
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-500 max-w-md mb-6">
                        Sorry, something unexpected happened. Please try again or navigate back.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-3">

                        {/* Primary */}
                        <button
                            onClick={this.handleReload}
                            className="px-6 py-2.5 rounded-lg bg-orange text-white font-medium 
    shadow-sm hover:shadow-md hover:bg-orange-dark 
    active:scale-95 transition-all duration-150"
                        >
                            Retry
                        </button>

                        {/* Secondary */}
                        <button
                            onClick={this.handleGoBack}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium 
    bg-white hover:bg-gray-50 hover:shadow-sm 
    active:scale-95 transition-all duration-150"
                        >
                            Go Back
                        </button>

                        {/* Ghost */}
                        <button
                            onClick={this.handleGoHome}
                            className="px-6 py-2.5 rounded-lg border border-grey-300  text-orange font-medium 
    hover:bg-orange-50 active:scale-95 
    transition-all duration-150"
                        >
                            Home Page
                        </button>

                    </div>

                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
