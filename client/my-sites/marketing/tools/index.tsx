/**
 * External dependencies
 */
import { useDispatch, useSelector } from 'react-redux';
import page from 'page';
import React, { Fragment, FunctionComponent } from 'react';
import { useTranslate, getLocaleSlug } from 'i18n-calypso';
import config from 'calypso/config';

/**
 * Internal dependencies
 */
import { Button } from '@automattic/components';
import { getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import { getCurrentUserId } from 'calypso/state/current-user/selectors';
import { getUserPurchases } from 'calypso/state/purchases/selectors';
import { hasTrafficGuidePurchase } from 'calypso/my-sites/marketing/ultimate-traffic-guide';
import MarketingToolsFeature from './feature';
import MarketingToolsHeader from './header';
import {
	marketingConnections,
	marketingTraffic,
	marketingUltimateTrafficGuide,
} from 'calypso/my-sites/marketing/paths';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import { recordTracksEvent as recordTracksEventAction } from 'calypso/state/analytics/actions';
import QueryUserPurchases from 'calypso/components/data/query-user-purchases';

/**
 * Images
 */
import earnIllustration from 'calypso/assets/images/customer-home/illustration--task-earn.svg';
import fiverrLogo from 'calypso/assets/images/customer-home/fiverr-logo.svg';
import facebookMessenger from 'calypso/assets/images/illustrations/facebook-messenger.svg';
import rocket from 'calypso/assets/images/customer-home/illustration--rocket.svg';

/**
 * Types
 */
import * as T from 'calypso/types';

/**
 * Style dependencies
 */
import './style.scss';

export const MarketingTools: FunctionComponent = () => {
	const translate = useTranslate();
	const dispatch = useDispatch();
	const recordTracksEvent = ( event: string ) => dispatch( recordTracksEventAction( event ) );
	const userId = useSelector( ( state ) => getCurrentUserId( state ) ) || 0;
	const selectedSiteSlug: T.SiteSlug | null = useSelector( ( state ) =>
		getSelectedSiteSlug( state )
	);
	const purchases = useSelector( ( state ) => getUserPurchases( state, userId ) );

	const handleBoostMyTrafficClick = () => {
		recordTracksEvent( 'calypso_marketing_tools_boost_my_traffic_button_click' );

		page( marketingTraffic( selectedSiteSlug ) );
	};

	const handleEarnClick = () => {
		recordTracksEvent( 'calypso_marketing_tools_earn_button_click' );

		page( `/earn/${ selectedSiteSlug }` );
	};

	const handleCreateALogoClick = () => {
		recordTracksEvent( 'calypso_marketing_tools_create_a_logo_button_click' );
	};

	const handleFacebookMessengerClick = () => {
		recordTracksEvent( 'calypso_marketing_tools_facebook_messenger_button_click' );
	};

	const handleFindYourExpertClick = () => {
		recordTracksEvent( 'calypso_marketing_tools_find_your_expert_button_click' );
	};

	const handleStartSharingClick = () => {
		recordTracksEvent( 'calypso_marketing_tools_start_sharing_button_click' );

		page( marketingConnections( selectedSiteSlug ) );
	};

	const handleUltimateTrafficGuideClick = () => {
		recordTracksEvent( 'calypso_marketing_tools_ultimate_traffic_guide_button_click' );

		page( marketingUltimateTrafficGuide( selectedSiteSlug ) );
	};

	const isEnglish = config( 'english_locales' ).includes( getLocaleSlug() );

	return (
		<Fragment>
			{ ! purchases && <QueryUserPurchases userId={ userId } /> }
			<PageViewTracker path="/marketing/tools/:site" title="Marketing > Tools" />

			<MarketingToolsHeader handleButtonClick={ handleBoostMyTrafficClick } />

			<div className="tools__feature-list">
				<MarketingToolsFeature
					title={ translate( 'Want to build a great brand? Start with a great logo' ) }
					description={ translate(
						'A custom logo helps your brand pop and makes your site memorable. Make a professional logo in a few clicks with our partner Fiverr.'
					) }
					imagePath={ fiverrLogo }
				>
					<Button
						onClick={ handleCreateALogoClick }
						href="https://wp.me/logo-maker"
						target="_blank"
					>
						{ translate( 'Create a logo' ) }
					</Button>
				</MarketingToolsFeature>

				{ getLocaleSlug() === 'en' && (
					<MarketingToolsFeature
						title={ translate( 'Want to convert visitors into customers? Add Messenger Chat!' ) }
						description={ translate(
							'Customers like to buy from a business they can message. Build trust, help customers, and provide support with the Official Facebook Messenger Chat Plugin. {{em}}Available on Business and eCommerce plans{{/em}}.',
							{
								components: {
									em: <em />,
								},
							}
						) }
						imagePath={ facebookMessenger }
					>
						<Button
							onClick={ handleFacebookMessengerClick }
							href="https://wordpress.com/plugins/facebook-messenger-customer-chat"
							target="_blank"
						>
							{ translate( 'Add Messenger Chat' ) }
						</Button>
					</MarketingToolsFeature>
				) }

				<MarketingToolsFeature
					title={ translate( 'Build your community, following, and income with Earn tools' ) }
					description={ translate(
						'Increase engagement and income on your site by accepting payments for just about anything – physical and digital goods, services, donations, or access to exclusive content.'
					) }
					imagePath={ earnIllustration }
				>
					<Button onClick={ handleEarnClick }>{ translate( 'Start earning' ) }</Button>
				</MarketingToolsFeature>

				<MarketingToolsFeature
					title={ translate( 'Get social, and share your blog posts where the people are' ) }
					description={ translate(
						"Use your site's Publicize tools to connect your site and your social media accounts, and share your new posts automatically. Connect to Twitter, Facebook, LinkedIn, and more."
					) }
					imagePath="/calypso/images/marketing/social-media-logos.svg"
				>
					<Button onClick={ handleStartSharingClick }>{ translate( 'Start sharing' ) }</Button>
				</MarketingToolsFeature>

				<MarketingToolsFeature
					title={ translate( 'Need an expert to help realize your vision? Hire one!' ) }
					description={ translate(
						"We've partnered with Upwork, a network of freelancers with a huge pool of WordPress experts. Hire a pro to help build your dream site."
					) }
					imagePath="/calypso/images/marketing/upwork-logo.png"
				>
					<Button
						onClick={ handleFindYourExpertClick }
						href={ '/experts/upwork?source=marketingtools' }
						target="_blank"
					>
						{ translate( 'Find your expert' ) }
					</Button>
				</MarketingToolsFeature>

				{ isEnglish && (
					<MarketingToolsFeature
						title={ translate( 'Introducing the WordPress.com Ultimate Traffic Guide' ) }
						description={ translate(
							"Our brand new Ultimate Traffic Guide reveals more than a dozen of today's most effective traffic techniques. " +
								'The guide is appropriate for beginner to intermediate users.'
						) }
						imagePath={ rocket }
					>
						<Button onClick={ handleUltimateTrafficGuideClick }>
							{ hasTrafficGuidePurchase( purchases )
								? translate( 'Download now' )
								: translate( 'Learn more' ) }
						</Button>
					</MarketingToolsFeature>
				) }
			</div>
		</Fragment>
	);
};

export default MarketingTools;
