require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Twitter API v2 endpoint
const TWITTER_API_BASE = 'https://api.twitter.com/2';

// Get Twitter user data
async function getTwitterUserData(username) {
    try {
        const bearerToken = process.env.TWITTER_BEARER_TOKEN;
        
        if (!bearerToken || bearerToken === '') {
            throw new Error('Twitter Bearer Token not configured in environment variables');
        }

        console.log('Attempting to fetch Twitter data for:', username);
        console.log('Bearer token exists:', !!bearerToken);
        console.log('Token length:', bearerToken?.length);

        // Get user by username
        const userResponse = await axios.get(
            `${TWITTER_API_BASE}/users/by/username/${username}`,
            {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                },
                params: {
                    'user.fields': 'created_at,description,public_metrics,verified,profile_image_url'
                },
                timeout: 10000
            }
        );

        const user = userResponse.data.data;
        const userId = user.id;

        console.log('User data fetched successfully for:', username);

        // Get user's recent tweets
        const tweetsResponse = await axios.get(
            `${TWITTER_API_BASE}/users/${userId}/tweets`,
            {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                },
                params: {
                    'max_results': 100,
                    'tweet.fields': 'created_at,public_metrics,entities',
                    'exclude': 'retweets,replies'
                },
                timeout: 10000
            }
        );

        console.log('Tweets fetched successfully');

        return {
            user,
            tweets: tweetsResponse.data.data || []
        };
    } catch (error) {
        console.error('Twitter API Error Details:');
        console.error('Status:', error.response?.status);
        console.error('Error message:', error.message);
        console.error('Response data:', error.response?.data);
        
        if (error.response?.status === 429) {
            const resetTime = error.response.headers['x-rate-limit-reset'];
            const resetDate = resetTime ? new Date(resetTime * 1000) : null;
            const waitMinutes = resetDate ? Math.ceil((resetDate - new Date()) / 60000) : 15;
            
            throw {
                status: 429,
                message: `Twitter API rate limit exceeded. Please try again in ${waitMinutes} minutes.`,
                resetTime: resetDate
            };
        }
        
        // Return more detailed error
        throw {
            status: error.response?.status || 500,
            message: error.response?.data?.detail || error.response?.data?.title || error.message,
            details: error.response?.data
        };
    }
}

// Generate demo data for demonstration
function getDemoUserData(username) {
    // Generate realistic demo data based on username
    const followerCount = 3000 + (username.length * 347);
    const followingCount = 500 + (username.length * 52);
    const tweetCount = 1500 + (username.length * 124);
    
    return {
        user: {
            id: '12345' + username.length,
            username: username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            created_at: new Date(Date.now() - (365 * 2 * 24 * 60 * 60 * 1000)).toISOString(), // 2 years ago
            description: `🚀 Content Creator | ${username.charAt(0).toUpperCase() + username.slice(1)} | Tech Enthusiast | Building in Public`,
            verified: followerCount > 5000,
            profile_image_url: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
            public_metrics: {
                followers_count: followerCount,
                following_count: followingCount,
                tweet_count: tweetCount,
                listed_count: Math.floor(followerCount / 100)
            }
        },
        tweets: Array.from({ length: 30 }, (_, i) => {
            const baseEngagement = Math.floor(followerCount * 0.02);
            return {
                id: `tweet${i}`,
                text: [
                    `Just shipped a new feature! 🚀 Building in public is the best way to grow. #buildinpublic`,
                    `Hot take: The best time to start is now. Stop overthinking, start building! 💪`,
                    `Shared my journey on X. From 0 to ${followerCount.toLocaleString()} followers in 2 years. Here's what I learned... 🧵`,
                    `New blog post: How I grew my audience on X 📈 Link in bio!`,
                    `Grateful for this amazing community! Thank you all for the support ❤️`,
                    `Pro tip: Consistency > Perfection. Keep showing up every single day! 💯`,
                    `Working on something exciting. Can't wait to share it with you all! ✨`,
                    `The algorithm favors engagement. Reply to comments, interact with your audience! 💬`,
                    `Just hit a major milestone! Couldn't have done it without you all 🙏`,
                    `Monday motivation: Your network is your net worth. Keep building! 🌟`
                ][i % 10],
                created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
                public_metrics: {
                    like_count: Math.floor(baseEngagement + (Math.random() * baseEngagement)),
                    retweet_count: Math.floor(baseEngagement * 0.3 + (Math.random() * baseEngagement * 0.3)),
                    reply_count: Math.floor(baseEngagement * 0.2 + (Math.random() * baseEngagement * 0.2)),
                    impression_count: Math.floor(followerCount * 2 + (Math.random() * followerCount * 3))
                }
            };
        })
    };
}

// Calculate income and projections
function calculateMetrics(userData) {
    const { user, tweets } = userData;
    const metrics = user.public_metrics;
    
    // Income calculation based on engagement metrics
    // These are industry-standard estimates
    const avgViewsPerTweet = tweets.reduce((sum, tweet) => {
        return sum + (tweet.public_metrics?.impression_count || 0);
    }, 0) / Math.max(tweets.length, 1);
    
    const avgEngagement = tweets.reduce((sum, tweet) => {
        const m = tweet.public_metrics || {};
        return sum + (m.like_count || 0) + (m.retweet_count || 0) + (m.reply_count || 0);
    }, 0) / Math.max(tweets.length, 1);

    const engagementRate = metrics.followers_count > 0 
        ? (avgEngagement / metrics.followers_count) * 100 
        : 0;

    // Income estimation (based on industry standards)
    const cpmRate = 5; // $5 per 1000 impressions (conservative estimate)
    const monthlyTweets = tweets.length * 3; // Assuming current pace
    const estimatedMonthlyViews = avgViewsPerTweet * monthlyTweets;
    const currentMonthlyIncome = (estimatedMonthlyViews / 1000) * cpmRate;

    // Calculate growth rate
    const accountAgeInMonths = Math.max(
        (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 30),
        1
    );
    const followerGrowthRate = metrics.followers_count / accountAgeInMonths;

    // Future projections
    const projections = [];
    let projectedFollowers = metrics.followers_count;
    let projectedIncome = currentMonthlyIncome;

    for (let i = 1; i <= 6; i++) {
        projectedFollowers += followerGrowthRate;
        const growthMultiplier = 1 + (followerGrowthRate / metrics.followers_count) * 0.5;
        projectedIncome *= growthMultiplier;
        
        projections.push({
            month: i,
            followers: Math.round(projectedFollowers),
            estimatedIncome: Math.round(projectedIncome * 100) / 100
        });
    }

    // Motivational metrics
    const influenceScore = Math.min(
        (metrics.followers_count / 10000) * 30 +
        (engagementRate) * 40 +
        (tweets.length / 100) * 30,
        100
    );

    const contentQualityScore = Math.min(
        (avgEngagement / 100) * 100,
        100
    );

    return {
        currentMetrics: {
            followers: metrics.followers_count,
            following: metrics.following_count,
            totalTweets: metrics.tweet_count,
            listed: metrics.listed_count,
            engagementRate: Math.round(engagementRate * 100) / 100,
            avgEngagement: Math.round(avgEngagement),
            avgViews: Math.round(avgViewsPerTweet)
        },
        income: {
            currentMonthly: Math.round(currentMonthlyIncome * 100) / 100,
            projectedAnnual: Math.round(currentMonthlyIncome * 12 * 100) / 100,
            cpmRate
        },
        projections,
        motivationalMetrics: {
            influenceScore: Math.round(influenceScore * 10) / 10,
            contentQualityScore: Math.round(contentQualityScore * 10) / 10,
            growthPotential: Math.min(Math.round(followerGrowthRate * 10), 100),
            consistencyScore: Math.min((tweets.length / 30) * 100, 100)
        },
        recentActivity: tweets.slice(0, 5).map(tweet => ({
            text: tweet.text.substring(0, 100) + (tweet.text.length > 100 ? '...' : ''),
            likes: tweet.public_metrics?.like_count || 0,
            retweets: tweet.public_metrics?.retweet_count || 0,
            replies: tweet.public_metrics?.reply_count || 0,
            createdAt: tweet.created_at
        }))
    };
}

// API endpoint
app.get('/api/analyze/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const useDemo = req.query.demo === 'true';
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        let userData;
        let isDemo = false;

        // Try real API first, fallback to demo on rate limit
        if (!useDemo) {
            try {
                userData = await getTwitterUserData(username);
            } catch (error) {
                console.error('API Error caught:', error);
                
                if (error.status === 429) {
                    return res.status(429).json({
                        success: false,
                        error: error.message,
                        resetTime: error.resetTime,
                        suggestion: 'Try demo mode to see how the tool works'
                    });
                }
                
                // Return detailed error for debugging
                return res.status(error.status || 500).json({
                    success: false,
                    error: error.message || 'Unable to fetch Twitter data',
                    details: error.details,
                    suggestion: 'Click "Try Demo" button to see sample analytics. The Twitter API might have rate limits or authentication issues.'
                });
            }
        } else {
            userData = getDemoUserData(username);
            isDemo = true;
        }

        const analytics = calculateMetrics(userData);

        res.json({
            success: true,
            isDemo,
            username: userData.user.username,
            displayName: userData.user.name,
            profileImage: userData.user.profile_image_url,
            verified: userData.user.verified,
            bio: userData.user.description,
            memberSince: userData.user.created_at,
            ...analytics
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.response?.data?.detail || error.message || 'Failed to fetch Twitter data'
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Twitter Analytics Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoint: http://localhost:${PORT}/api/analyze/:username`);
});
