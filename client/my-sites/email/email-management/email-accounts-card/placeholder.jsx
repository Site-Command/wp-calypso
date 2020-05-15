/**
 * External dependencies
 */

import React from 'react';

/**
 * Internal dependencies
 */
import { CompactCard } from '@automattic/components';
import SectionHeader from 'components/section-header';
import GSuiteUserItem from 'my-sites/email/email-management/gsuite-user-item';

/**
 * Style dependencies
 */
import './style.scss';

const Placeholder = () => (
	<div className="email-accounts-card__container is-placeholder">
		<SectionHeader label={ 'G Suite Users' } />
		<CompactCard className="email-accounts-card__user-list">
			<ul className="email-accounts-card__user-list-inner">
				<GSuiteUserItem user={ { email: 'mail@example.com', domain: 'example.com' } } />
			</ul>
		</CompactCard>
	</div>
);

export default Placeholder;
