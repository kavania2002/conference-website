import Link from 'next/link';
import Dropdown from '../illustration/dropdown';
import { useState, useEffect, useRef, useCallback } from 'react';
import links from '../../config/links.json';
import NavDrop from './navDrop';
import Hamburger from '../illustration/hamburger';
import { useMediaQuery } from 'react-responsive';
import Cancel from '../illustration/cancel';
import Image from 'next/image';



function Navbar() {
	const isTablet = useMediaQuery({ maxWidth: '1118px' });
	const [drop, setDrop] = useState(false);
	const [show, setShow] = useState(null);
	const menuRef = useRef(null);
	const svg = useRef(null);
	const handleClosing = useCallback((event) => {
		if (show && !event.target.closest('.subMenu')) {
			setShow(false);
		}
	}, [show]);
	useEffect(() => {
		document.addEventListener('mousedown', handleClosing);
		return () => {
			document.removeEventListener('mousedown', handleClosing);
		};
	}, [handleClosing, show]);

	const handleCloseMenu = (event) => {
		if (menuRef.current && !menuRef.current.contains(event.target)) {
			setDrop(false);
		} if (svg.current && event.target == svg.current) {
			setDrop(true);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleCloseMenu);
		return () => {
			document.removeEventListener('click', handleCloseMenu);
		};
	}, [menuRef]);

	const handleVenueHover = () => {
		setShow('Venue');
	};
	const handleSubMenuLeave = () => {
		setShow(null);
	};
	return (
		<div className='flex justify-center items-center sticky top-0 z-[99] text-white'>
			<div className='w-[1131px]'>
				<div className='p-5 flex justify-between h-[75px] w-full items-center'>
					<div className='flex items-center sm:justify-between sm:w-full'>
						<Link href='/'>
							<div className='flex items-center cursor-pointer'>
								<Image src='/img/logo.png' alt='conference logo' width={120} height={33} />
							</div>
						</Link>
					</div>
					{isTablet ? (
						<div>
							{drop ? (
								<button>
									<Cancel />
								</button>
							) : (
								<button>
									<Hamburger ref={svg} />
								</button>
							)}
						</div>
					) : (
						<div className='flex items-center'>
							{links.map((link) => (
								<div href={link.ref} key={link.title}>
									<div
										onMouseEnter={() => setShow(link.title === 'Venue' ? 'Venue' : null)}
										onClick={() => setShow(link.title === 'Venue' ? null : link.title)}
										className='ml-16 text-[14px] group cursor-pointer relative flex flex-col'
									>
										<div>
											{link.subMenu ? (
												<div
													onMouseEnter={handleVenueHover}
													className='flex items-center '>
													{link.title}{' '}
													{link.subMenu && (
														<Dropdown
															color="white"
															className={`ml-2 transition-transform duration-700 ${show === link.title ? 'rotate-180' : 'rotate-0'
																}`}
														/>
													)}
												</div>
											) : (
												<Link href={link.ref}>{link.title}</Link>
											)}
										</div>
										{show && show === link.title && link.subMenu && (
											<div
												onMouseLeave={handleSubMenuLeave}
												className='subMenu absolute z-[9] mt-8 w-[140px] rounded-md left-[-15px] gradient-bg pl-2 pt-1 flex flex-col justify-center space-y-0'>
												{link.subMenu.map((subL) => (
													<Link href={subL.ref} key={subL.title}>
														<div className='h-[32px] text-[16px] hover:scale-95 hover:translate-x-1 transition-all'>
															{subL.title}
														</div>
													</Link>
												))}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
					{isTablet && drop && <NavDrop setDrop={setDrop} ref={menuRef} />}
				</div>
			</div>
		</div>
	);
}

export default Navbar;