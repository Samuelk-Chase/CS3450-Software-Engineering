## Business Requirements
The following business requirements will be used to increase revenue and overall player count for the customer. These requirements will help business operators make decisions and improve the business side of the game.



### Analytics
The program should store information about users and how they engage with the platform. The following information should be tracked and sent to a separate business server for analyzing the data. This data will serve to inform business operators of demographics to target, features that will increase play time and player count, and the overall health of the game.

  * ***User Engagement:*** The program should keep track of users' time spent in activities such as single-player experiences, multiplayer, and co-op experiences within the game.

  * ***User Spending:*** The program should keep track of the user's monetary transactions within the game. It should store when, how much, and what the user spent money on. 

  * ***User Information:*** The program should keep track of user demographic info such as location, age, and hardware.

  * ***Player Count:*** The program should keep track of the number of active players per day.
    
  * ***Data Retrieval***: Business operators should be able to download data into common data formats such as .xlsx and Json for analysis.

### User Acquisition Strategy:
A variety of strategies will be executed to increase user acquisition. 

* ***Search Engine Optimization (SEO):*** The game’s website and app store listings should be optimized with targeted keywords to rank higher in search results.

* ***User Targeted Ads:*** User analytics should be used to target ads towards the demographic of people who play the game the most such as RPG enjoyers, Card game enjoyers, and other groups identified by game analytics.

* ***Multiplayer:*** The game should include multiplayer elements such as co-op battles and player versus player battles to encourage friends to buy the game.

* ***Referrals:*** The game should offer rewards such as loot boxes for current users for each new user they get to sign up.

*  ***New User Rewards:*** The game should offer in-game incentives such as loot boxes for new users who join.

*  ***Language Support:*** The game should be able to support multiple languages to reach a broader audience.

*  ***Accessibility:*** The game must adhere to accessibility standards, such as support for screen readers, text-to-speech, and customizable font sizes to reach a broader audience.

*  ***Platform Access***: The game should be built on a widely accessible platform like the web or multiple platforms to maximize access to the game.



#### Community Building
As part of user acquisition, the game should deploy a variety of features to foster a strong community for the game which will in return attract more players.

* ***Single Player Leaderboard:*** The game should provide a global leaderboard that tracks the fastest time through the single-player campaign to foster a speed-running community. 

* ***Multi-Player Leaderboard:*** The game should provide a multiplayer leaderboard, tracking the most wins and win percentage to encourage a competitive scene.

* ***Social Media Engagement:*** Social media channels should be created and regularly updated with content such as sneak peeks, gameplay trailers, updates, and community engagement. These accounts should be accessible from the game's main website.

*  ***Community Promotion:*** The official site should promote community content such as YouTube videos and Twitch streams to build a healthy community.
  

  
### User Retention Strategy
A variety of strategies and features should be deployed to encourage players to continue playing the game.

 * ***Daily and Weekly Challenges:***	Offer daily and weekly challenges that reward players with bonuses such as experience points, currency, or unique cards. These challenges should be worthwhile for the player to encourage players to return regularly.
   
 * ***Achievement System:***	The game should offer an extensive achievement system where players can unlock milestones, titles, and special rewards based on their progress and accomplishments to encourage more playtime.
  
 * ***Progression System:*** The game should implement level-based progression where players unlock new gameplay features, cards, and things to do.
  
 * ***In-Game Events:*** The game should host limited-time events that feature exclusive content, challenges, or storylines. These events can encourage players to log in and participate during a specific time window.
   
 * ***Push Notifications:***	The game should utilize push notifications and emails to remind players of upcoming events, challenges, and important updates. Offer incentives like bonus rewards for logging in after a period of inactivity.







### Quality Control and Feedback:
The program should provide a method for users to give feedback to improve the program and user experience.

* ***Bug reporting:*** Players should be able to report bugs and issues they come across in the game.

* ***Game Feedback:*** Players should have the option in the game to send feedback for improvements.

* ***Activity Feedback:*** When new features or gameplay mechanics are introduced the user should be prompted to rate the experience and send feedback if necessary.

  



### Monetization:
The game should employ a variety of monetization options.

* ***Paid Model:*** Players should pay for the game using a payment service such as Stripe. 

* ***Free Demo:*** A free demo should be offered for players to try the game for free by playing through 2 boss battles. After the trial expires they should be prompted to upgrade to the full paid version of the game.

* ***In-Game Monetization***: The game should not have micro-transactions. The game should allow players on the free trial to buy the full game in-game and should be built to allow future DLC content to be bought in-game as well as on other platforms it is built on.


### Scalability
The game should be built to allow growth in users and experiences:

* ***Data-base***: The database must be capable of scaling to millions of players. 

* ***Game experiences***: The game should allow for easy implementation of future content such as DLCs and special events.

* ***Servers***: Game Servers must be able to handle high traffic as much as 1 million concurrent players at a time.



### Security
User information and game services should be secure

* ***System Authorization:*** The system should only be accessible to authorized employees such as software engineers and business operators. The system should employ some employee verification system (employee sign-in) allowing only authorized personnel to access the site.

* ***User Account Security:***: User's accounts must be secured through username and password. Passwords and emails must not be in plain text and must be encrypted.
  
 * ***User Data:*** Personal user data should be encrypted and user data for analytics should be anonymized. Data storage should comply with data protection regulations.




### Business Requirements MoSCoW Analysis:
For version 1.0 of our project, we will largely focus on the main core single-player experience, so many of our business requirements will not be prioritized until the base gameplay of our game is finished. If must have business requirements conflict with core game requirements we will prioritize the game requirements and focus on business requirements in version 2.0.

#### Must-Have:

* ***Progression features:*** We will have some progression system in version 1.0 that will allow users to feel like they are making progress. To begin this will be based on card collection. Other progression features will be treated as could haves for version 1.0.

* ***Paid Model:*** We will prioritize the paid model over all other monetization options since the customer wants to make money from the game. This implementation should be easier to implement than others and is a generally accepted monetization model. 

* ***User Data Security:*** We will prioritize protecting user data.

* ***User Account Security:*** We will require users to create an account with a username, email, and password to sign in. Passwords and emails will be encrypted.
  
#### Should-Have:

* ***Multiplayer:*** We believe this is an important aspect of creating a fun game people can play. Multiplayer will help with user retention and recruiting new players, but we want the core single-player gameplay to be prioritized first since it makes up the bulk of the customer's wants. If single-player is polished we will move to Multiplayer implementation next.
  
* ***System Authorization:*** Before the product ships we should have some form of system authorization. However, because we are mostly focused on core gameplay we anticipate system authorization will not be highly prioritized until the core game is built. System authorization during this initial development cycle will be handled through Git Hub.

* ***Database Scalability:*** Our database should be able to scale. Since gameplay is the most important we won't prioritize this as high, but we believe we can implement a scalable database to account for a growing player base.


#### Could-Have:
* ***Leaderboards:*** Leaderboards could be implemented, but are likely more suitable after core gameplay features and mechanics are implemented. The game should be fun to play before trying to build a competitive scene.
  
* ***Analytics:*** We could implement a way to track user information for analytic purposes as that would be helpful for the business owner to make decisions, but we don't expect this will be in version 1.0. We want the game to be playable before we worry about collecting data for business decisions.

* ***User Acquisition:*** While user acquisition will be key for the game to be popular in the long term, we want to prioritize making the game playable and fun before implementing new ways to gain players. Focusing on making the core gameplay fun will be far more productive in enticing new players than trying other methods of recruitment. Multiplayer will be prioritized over other user acquisition strategies since it is gameplay-based but will come second to the single-player base game. If single-player and multiplayer are implemented we will move on to adding some of the feature requirements listed in the User Acquisition section to begin to expand the player base, but we don't expect these will be in version 1.0.

* ***Achievement System:*** An achievement system would be a great feature to retain players and increase playtime, but will not be prioritized over core gameplay mechanics. This likely will be in version 2.0.

* ***Bug reporting and Game Feedback:*** Bug reporting and game feedback will be crucial in maintaining the game, but we don't expect this to be present in version 1.0. While reporting/feedback likely won't be integrated straight into the game in this version, the business can rely on emails and app store feedback if used until these features are implemented.

* ***Social Media:*** If by the end of this development phase, the game is ready to launch, creating social media channels will be important in community building and advertising. Our focus is on the game itself so social media will not be as highly prioritized until we have a finished product to build a community around.

* ***Scalable Server:*** The server should be scalable, but we are more interested in making sure the game functions. Server capacity can be upgraded after the game is built and players start to join.

  
  
#### Won't Have:

* ***Localization:*** The game won't have support for other languages in version 1.0, but may become available in other languages after core gameplay has been implemented. Our focus for this cycle will be to target the English-speaking audience.

*  ***Accessibility:*** Accessibility is important but our focus will be on making the game playable for version 1.0. As the game becomes more polished we can begin to add accessibility features to broaden our audience in Version 2.0.

* ***In-game Monetization***: We will not be implementing in-game monetization for this version since we don't have any DLC content as the base game has not yet been developed. We will provide an option to pay for the game, but it likely won't be built directly into the game itself until future versions.

* ***Push Notifications, Daily and Weekly Challenges, In-game Events:*** These retention features may be prioritized in future versions of the game to retain the player base, but will not be implemented in version 1.0 since improving the core game experience will be the best way to retain new players in the games infancy.

* ***Game Content Scalability:*** We think it is important to build a game that makes adding new content easy, but we are focused on the main gameplay at this time. Also, AI implementation in the game should add a fresh experience that will allow the need for new content to be minimized in the future.

* ***Platform Access:*** The focus on version 1.0 will be game mechanics so we will develop for only one platform. We will choose a popular platform to reach a larger audience. If successful the game could be expanded to other platforms in version 2.0.



Note: Chat-GPT was used to generate some of the ideas for business requirements. It also wrote a few requirements such as SEO requirements, Social media Campaigns, Accessibility, Language,  and a lot of user retention strategies.


##### Business Operator User Stories:

* As a business operator, I want data for analytics so that I can better understand how users are playing the game and make good decisions for the game in the future.

* As a business operator, I want user feedback so that I can make decisions that will improve the game and increase revenue.

* As a business operator, I want to monetize the game so that I can make money.

* As a business operator, I want to advertise the game so that more games are bought and I can make money.

* As a business operator, I want to develop a community for the game so that player acquisition is cheaper and more organic.

* As a business operator, I want to increase playtime in-game so that I can make more money.

* As a business operator, I want data to be secure so that customers trust the game and I don't get sued.
