# 📊 X (Twitter) Analytics & Income Tracker

**Created by Yousuf Aziz**

A powerful real-time analytics tool that analyzes X (Twitter) accounts to display:
- Current income estimates
- Profile activity statistics
- Motivational performance metrics
- 6-month income projections based on current activity levels

## 🚀 Features

✅ **Real-time Twitter API Integration**
- Fetches live data from X (Twitter) API v2
- Analyzes user profile metrics
- Retrieves recent posts and engagement data

✅ **Income Calculations**
- Estimated monthly income based on engagement
- Projected annual earnings
- CPM-based revenue estimates (industry standards)

✅ **Future Projections**
- 6-month income forecasts
- Follower growth predictions
- Interactive projection charts

✅ **Performance Metrics**
- Influence Score
- Content Quality Score
- Growth Potential
- Consistency Score

✅ **Beautiful UI**
- Modern gradient design
- Responsive layout
- Interactive charts and visualizations
- Real-time data updates

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **Twitter Developer Account** and API Bearer Token

## 🔑 Getting Your Twitter API Bearer Token

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter account
3. Create a new Project and App (or use existing one)
4. Navigate to your App's "Keys and Tokens" section
5. Generate/Copy your **Bearer Token**
6. Add it to your `.env` file

## 📦 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure your Twitter API token:**
   - Open the `.env` file
   - Replace the empty value with your Twitter Bearer Token:
```
TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
PORT=3000
```

## 🎮 Usage

1. **Start the server:**
```bash
npm start
```

2. **Open your browser:**
   - Navigate to `http://localhost:3000`

3. **Analyze any X (Twitter) account:**
   - Enter a username (e.g., `elonmusk`, `naval`, `jack`)
   - Click "Analyze"
   - View comprehensive analytics!

## 📊 What You'll See

### Current Metrics
- Follower count
- Engagement rate
- Average engagement per post
- Total posts

### Income Estimates
- **Current Monthly Income**: Based on current engagement levels
- **Projected Annual Income**: Estimated yearly earnings
- Revenue calculated using industry-standard CPM rates

### 6-Month Projections
Visual chart showing:
- Projected follower growth
- Estimated income for each month
- Based on current growth rate and activity

### Performance Scores
- **Influence Score**: Overall impact and reach
- **Content Quality Score**: Engagement quality
- **Growth Potential**: Room for expansion
- **Consistency Score**: Posting regularity

### Recent Activity
- Latest 5 posts
- Engagement metrics per post
- Timestamps

## 🔧 How It Works

1. **Data Fetching**: Uses Twitter API v2 to fetch user profile and recent tweets
2. **Metrics Calculation**: 
   - Analyzes engagement patterns
   - Calculates CPM-based revenue (conservative $5 per 1000 impressions)
   - Determines growth rates from account history
3. **Projections**: 
   - Uses historical growth to forecast future metrics
   - Applies realistic growth multipliers
   - Projects income based on increasing engagement
4. **Visualization**: Displays data in beautiful, interactive charts

## 💰 Income Calculation Method

The tool uses industry-standard methods:
- **CPM Rate**: $5 per 1,000 impressions (conservative estimate)
- **Monthly Views**: Based on recent post performance
- **Engagement Multiplier**: Accounts for growing audience
- **Growth Rate**: Calculated from account age and follower count

**Note**: These are estimates based on industry averages. Actual earnings vary based on:
- Monetization programs (Twitter Blue, Creator Subscriptions)
- Sponsorships and partnerships
- Content niche and audience demographics

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **API**: Twitter API v2
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Libraries**: Axios, CORS, dotenv

## 📝 API Endpoints

### GET `/api/analyze/:username`
Analyzes a Twitter account and returns comprehensive metrics.

**Response:**
```json
{
  "success": true,
  "username": "example",
  "displayName": "Example User",
  "currentMetrics": {...},
  "income": {...},
  "projections": [...],
  "motivationalMetrics": {...},
  "recentActivity": [...]
}
```

## 🎨 Customization

You can customize:
- CPM rates in `server.js` (line 70)
- Projection period (currently 6 months)
- Styling in `public/index.html`
- Metric calculations

## ⚠️ Important Notes

- **API Limits**: Twitter API has rate limits. Free tier allows limited requests.
- **Data Accuracy**: Projections are estimates based on current trends
- **Privacy**: No data is stored; all calculations happen in real-time
- **Token Security**: Never share your Bearer Token publicly

## 🐛 Troubleshooting

**Error: "Twitter Bearer Token not configured"**
- Make sure you've added your token to `.env` file
- Restart the server after updating `.env`

**Error: "Failed to fetch Twitter data"**
- Check if the username is correct
- Verify your Bearer Token is valid
- Check Twitter API rate limits

**No data showing:**
- Open browser console (F12) to check for errors
- Verify server is running on port 3000
- Check if firewall is blocking the connection

## 📄 License

ISC

## 👨‍💻 Created By

**Yousuf Aziz**

---

Enjoy analyzing Twitter accounts and discovering earning potential! 🚀
