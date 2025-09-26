import { Music, Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  const footerNavigation = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Download', href: '#download' },
      { name: 'Updates', href: '#updates' },
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Status', href: '#status' },
      { name: 'Feedback', href: '#feedback' },
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
      { name: 'License', href: '#license' },
    ],
    social: [
      {
        name: 'GitHub',
        href: '#',
        icon: Github,
      },
      {
        name: 'Twitter',
        href: '#',
        icon: Twitter,
      },
      {
        name: 'Email',
        href: 'mailto:support@ytmusicpro.com',
        icon: Mail,
      },
    ],
  }

  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                YT Music Pro
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              The most powerful and user-friendly YouTube music downloader.
              Download high-quality MP3s with lightning speed and professional features.
            </p>
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <IconComponent className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.product.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-700 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 YT Music Pro. All rights reserved.
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-400 sm:mt-0">
              Made with ♥ for music lovers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}