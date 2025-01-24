# Second Newer Draft
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




























# First Draft

## Business Requirements
The following business requirements will be used to increase revenue and overall player count for the customer.



### Analytics
The program will store information about users and how they engage with the platform. The following information will be tracked and sent to a separate business server for analyzing the data. This data will serve to inform business operators of demographics to target, features that will increase play time and player count, and the overall health of the game.

  * ***User Engagement:*** The program will keep track of users' time spent in activities such as single-player experiences, multiplayer, and co-op experiences within the game.

  * ***User Spending:*** The program will keep track of the user's monetary transactions within the game. It will store when, how much, and what the user spent money on. 

  * ***User Information:*** The program will keep track of user demographic info such as location, age, and hardware.

  * ***Player Count:*** The program will keep track of the number of active players per day.


### User Acquisition Strategy:
A variety of strategies will be executed to increase user acquisition. 

* ***Search Engine Optimization (SEO):*** Optimize the game’s website and app store listings with targeted keywords to rank higher in search results.

* ***User Targeted Ads:*** User analytics should be used to target ads towards the demographic of people who play the game the most such as RPG enjoyers and Card game enjoyers or from other groups identified by game analytics.

* ***Multiplayer:*** The game should include multiplayer elements such as co-op battles and player versus player battles to encourage friends to buy the game.

* ***Referrals:*** The game should offer rewards such as loot boxes for each new user they sign up. When a new user signs up they will have the option to enter the username of the person that referred them to the game so that both receive a loot box with cards.

* ***"Next-level Marketing Strategy:"*** Users will be able to pay a monthly fee to become a game distributor. For every person they get to buy the game, they will receive 10% of the game sale. They can sign up others to be game distributors under them for which they will receive 5% of any game sales their game distributors sell. Game distributors will also get a special in-game icon to represent themselves. (Definitely Won't have)
  

#### Community Building
As part of our user acquisition strategy, we will deploy a variety of features in order to foster a strong community for the game which will in return attract more players.

* ***Single Player Leaderboard:*** The game will provide a global leaderboard that tracks the fastest time through the single-player campaign to foster a speed-running community. 

* ***Multi-Player Leaderboard:*** The game will provide a multiplayer leaderboard, tracking the most wins and win percentage to encourage a competitive scene.

* ***Official Community Discord:*** An official discord for the game will be created and linked on the official game site. Players will then be able to communicate with others around the world and play together.

*  ***Embedded-Twitch Streams:*** The official site for the game will have a page that displays the current top streamers in our game, to encourage streamers to play the game and build a streaming community around the game.

*  ***Embedded Community Youtube Videos:*** The official site for the game will have a community tab where the top-performing community videos for the month will appear to foster a community for the game on YouTube.

*  ***Social Media Campaigns:*** Regularly update social media channels (Twitter, Facebook, Instagram, TikTok) with content like sneak peeks, gameplay trailers, updates, and community engagement. Social media channels will be linked on the official game site.

  
### User Retention Strategy
We will employ a variety of strategies and features to encourage players to continue playing the game.

 * ***Daily and Weekly Challenges:***	Offer daily and weekly challenges that reward players with experience points, currency, or unique cards. These challenges encourage players to return regularly.
   
 * ***Achievement System:***	Include an extensive achievement system where players can unlock milestones, titles, and special rewards based on their progress and accomplishments.
  
 * ***Progression System:*** Implement level-based progression where players unlock new gameplay features, cards, and things to do.
  
 * ***In-Game Events:*** Host limited-time events that feature exclusive content, challenges, or storylines. These events can encourage players to log in and participate during a specific time window.
   
 * ***Push Notifications:***	Utilize push notifications and emails to remind players of upcoming events, challenges, and important updates. Offer incentives like bonus rewards for logging in after a period of inactivity.







### Quality Control and Feedback:
The program will provide a method for users to give feedback to improve the program and user experience.

* ***Bug reporting:*** Players will be able to report bugs and issues they come across in the game.

* ***Game Feedback:*** Players will have the option in the game to send feedback for improvements.

* ***Activity Feedback:*** When new features or gameplay mechanics are introduced the user will be prompted to rate the experience and send feedback if necessary.

  



### Monetization:
The game will employ a variety of monetization options.

* ***Paid Model:*** Players must pay for the game using a payment service such as Stripe. 

* ***Free Demo:*** Players can download the game for free and play through 2 boss battles. After the trial expires they will be asked to upgrade to the full paid version of the game.

* ***Character Slots:*** Players are given 3 character slots for buying the game. Players may either delete previous characters or pay for additional character slots to create more than 3 characters.`

* ***Loot boxes:*** The player may buy loot boxes which will reward cards they can add to their deck.
  
* ***Character Boosts:*** The user may purchase character boosts that improve key stats in single-player mode.

* ***Name Changes:*** Players will be able to pay to change their user name once.`

* ***Content Pass:*** A monthly pass will be offered allowing users to access special co-op and multi-player battles features which may reward unique cards.



### Business Requirements MoSCoW Analysis:
For version 1.0 of our project, we will largely focus on the main core single-player experience, so many of our business requirements will not be prioritized until the base gameplay of our game is finished. If must have business requirements conflict with core game requirements we will prioritize the game requirements and focus on business requirements in version 2.0.

#### Must-Have:

* ***Progression features:*** We will have some progression system in version 1.0 that will allow users to feel like they are making progress. To begin this will be based on card collection. Other progression features will be treated as could haves for version 1.0.

* ***Paid Model:*** We will prioritize the paid model over all other monetization options since the customer wants to make money from the game. This implementation should be easier to implement than others and is a generally accepted monetization model. 

#### Should-Have:

* ***Multiplayer:*** We believe this is an important aspect of creating a fun game people can play. Multiplayer will help with user retention and recruiting new players, but we want the core single-player gameplay to be prioritized first since it makes up the bulk of the customer's wants. If single-player is polished we will move to Multiplayer implementation next.
  
  




#### Could-Have:
* ***Leaderboards:*** Leaderboards could be implemented, but are likely more suitable after core gameplay features and mechanics are implemented. The game should be fun to play before trying to build a competitive scene.
  
* ***Analytics:*** We could implement a way to track user information for analytic purposes as that would be helpful for the business owner to make decisions, but we don't expect this will be in version 1.0. We want the game to be playable before we worry about collecting data for business decisions.

* ***User Acquisition:*** While user acquisition will be key for the game to be popular in the long term, we want to prioritize making the game playable and fun before implementing new ways to gain players. Focusing on making the core gameplay fun will be far more productive in enticing new players than trying other methods of recruitment. Multiplayer will be prioritized over other user acquisition strategies since it is gameplay-based but will come second to the single-player base game. If single-player and multiplayer are implemented we will move on to adding some of the feature requirements listed in the User Acquisition section to begin to expand the player base, but we don't expect these will be in version 1.0.

* ***Achievement System:*** An achievement system would be a great feature to retain players and increase playtime, but will not be prioritized over core gameplay mechanics. This likely will be in version 2.0.

* ***Bug reporting and Game Feedback:*** Bug reporting and game feedback will be crucial in maintaining the game, but we don't expect this to be present in version 1.0. While reporting/feedback likely won't be integrated straight into the game in this version, the business can rely on emails and app store feedback until these features are implemented.

* ***Official Community Discord:*** Discord will be important in fostering an active community for our game, but we are prioritizing gameplay during this development phase. Until we have a working product, we don't have anything to build a discord community around.

* ***Social Media Campaigns:*** If by the end of this development phase, the game is ready to launch, creating social media channels will be important in community building and advertising. Our focus is on the game itself so social media will not be as highly prioritized until we have a finished product. 
  
#### Won't Have:


* ***Monetization options***: We will not be implementing in-game monetization for this version. Monetization options will need to be analyzed after the business better understands how users play the game. Any of the monetization options could work but should be limited to those that give some benefit to the player and should be limited in number so as not to ruin the reputation of the company. 

   * ***Name change monetization:*** We won't be implementing name change monetization because we already have more important monetization strategies and don't want over monetize the game such that users view it as a money grab.
   
   * ***"Next-level Marketing":*** This is indeed an idea, but likely a terrible idea that would ruin the reputation of the game, but it is always an option in the future if the customer gets desperate.`
   
   * ***Character Boost Monetization:*** Like name change monetization we already have some standard monetization options and don't want to over-monetize the game, but it remains an option if the customer is not happy with other monetization options.
   
   * ***Free Demo:*** We believe this is a good idea for future versions of the game, but we will not implement it in version 1.0 as our priorities are gameplay and basic monetization.
   
   * ***Loot boxes:*** Loot boxes could be used in future versions of the game to improve revenue with our existing player base, but we will not be implementing them in version 1.0 as core gameplay is more important.
   
   * ***Character Slot monetization:*** Depending on how many characters users make, this may be an option in future versions of the game to increase revenue from the existing player base, but we will not be implementing it at least until version 1.0 is complete and player behavior in-game is understood.
 
   * ***Content Pass:*** As most of our development will be focused on core gameplay, we will not have extra content to use for a content pass. In future versions, as the game grows and developers can focus on new content, this could serve as an excellent way to generate consistent revenue. 
 
* ***Activity Feedback:*** This could be a useful feature in future versions of the game, but will not be implemented in version 1.0 since game activities will be limited. When the game is polished and can begin adding new content this will be a good way for the business to gauge what kind of activities the users are enjoying.
  

* ***Push Notifications, Daily and Weekly Challenges, In-game Events:*** These retention features may be prioritized in future versions of the game to retain the player base, but will not be implemented in version 1.0 since improving the core game experience will be the best way to retain new players in the games infancy.

* ***Embedded Twitch Streams and YouTube Videos:*** Providing a place for users to find community content will be useful in future versions of the game at community building, but we don't yet have a player base or community to do this. Once the player base grows we can embed community content from Twitch and YouTube to grow the community even larger.
  

Note: Chat-GPT was used to generate some of the ideas for business requirements. It also wrote a few requirements such as SEO requirements, Social media Campaigns, and most of the user retention strategy.


##### Business Operator User Stories:

* As a business operator, I want data for analytics so that I can better understand how users are playing the game and make good decisions for the game in the future.

* As a business operator, I want user feedback so that I can make decisions that will improve the game and increase revenue.

* As a business operator, I want to monetize the game so that I can make money.

* As a business operator, I want to advertise the game so that more games are bought and I can make money.

* As a business operator, I want to develop a community for the game so that player acquisition is cheaper and more organic.

* As a business operator, I want to increase playtime in-game so that I can make more money.







