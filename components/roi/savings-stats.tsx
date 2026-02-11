import React from 'react';

const SavingsStats: React.FC = () => {
    return (
        <div className="savings-stats">
            <h2>Big Impact Stats</h2>
            <div className="stat-item">
                <i className="icon-savings"></i>
                <span>30% Increase in Savings</span>
            </div>
            <div className="stat-item">
                <i className="icon-usage"></i>
                <span>25% Decrease in Usage</span>
            </div>
            <div className="stat-item">
                <i className="icon-investment"></i>
                <span>40% Rise in ROI</span>
            </div>
        </div>
    );
};

export default SavingsStats;