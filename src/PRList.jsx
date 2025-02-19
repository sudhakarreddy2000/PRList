import React, { useEffect, useState } from 'react';

const PRList = () => {
    const [prs, setPrs] = useState([]);
    const [filteredPrs, setFilteredPrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [labels, setLabels] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState('');

    const apiUrl = 'https://api.github.com/repos/divvydose/ui-coding-challenge/pulls';

    // Fetch PRs from GitHub API
    useEffect(() => {
        const fetchPRs = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch PRs');
                }
                const data = await response.json();
                setPrs(data);
                setFilteredPrs(data); // Initially, show all PRs
                extractLabels(data); // Extract available labels
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        // Extract labels from PRs
        const extractLabels = (prs) => {
            const allLabels = prs.flatMap(pr => pr.labels.map(label => label.name));
            const uniqueLabels = [...new Set(allLabels)];
            setLabels(uniqueLabels);
        };

        fetchPRs();
    }, []);

    // Filter PRs based on selected label
    const handleLabelChange = (e) => {
        const selected = e.target.value;
        setSelectedLabel(selected);

        if (selected === '') {
            setFilteredPrs(prs); // Show all PRs if no label is selected
        } else {
            const filtered = prs.filter(pr =>
                pr.labels.some(label => label.name === selected)
            );
            setFilteredPrs(filtered);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1>Pull Requests from ui-coding-challenge</h1>

            <div>
                <label htmlFor="label-filter">Filter by Label: </label>
                <select
                    id="label-filter"
                    value={selectedLabel}
                    onChange={handleLabelChange}
                >
                    <option value="">All</option>
                    {labels.map((label) => (
                        <option key={label} value={label}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {filteredPrs.length > 0 ? (
                <ul className="pr-list">
                    {filteredPrs.map((pr) => (
                        <li key={pr.id} className="pr-item">
                            <div className="pr-title">
                                <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
                                    {pr.title}
                                </a>
                            </div>
                            <div className="pr-info">
                                Created by: {pr.user.login} | State: {pr.state}
                            </div>
                            <div className="pr-info">
                                Opened on: {new Date(pr.created_at).toLocaleDateString()}
                            </div>
                            <div className="pr-info">
                                Labels: {pr.labels.map((label) => label.name).join(', ')}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No PRs found.</p>
            )}
        </div>
    );
};

export default PRList;
