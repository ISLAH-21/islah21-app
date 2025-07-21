import ALumniSocialLink from "./alumniSocialLink";
import BehanceIcon from "./icons/fa6-brands:behance.svg";
import FacebookIcon from "./icons/fa6-brands:facebook-f.svg";
import GithubIcon from "./icons/fa6-brands:github.svg";
import InstagramIcon from "./icons/fa6-brands:instagram.svg";
import LinkedInIcon from "./icons/fa6-brands:linkedin-in.svg";
import XIcon from "./icons/fa6-brands:x-twitter.svg";
import WebsiteIcon from "./icons/mynaui:globe.svg";

export default function AlumniSocial({ alumni }) {
  const links = [
    {
      key: "instagram",
      href: alumni.socialMedia?.instagram,
      Icon: InstagramIcon,
      iconClassName: "size-5",
    },
    {
      key: "x",
      href: alumni.socialMedia?.x,
      Icon: XIcon,
      iconClassName: "size-4.5",
    },
    {
      key: "github",
      href: alumni.socialMedia?.github,
      Icon: GithubIcon,
      iconClassName: "size-5",
    },
    {
      key: "linkedin",
      href: alumni.socialMedia?.linkedin,
      Icon: LinkedInIcon,
      iconClassName: "size-4.5",
    },
    {
      key: "behance",
      href: alumni.socialMedia?.behance,
      Icon: BehanceIcon,
      iconClassName: "size-5",
    },
    {
      key: "facebook",
      href: alumni.socialMedia?.facebook,
      className: "items-end",
      Icon: FacebookIcon,
      iconClassName: "size-5.5",
    },
  ].filter((link) => !!link.href);

  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <div className="flex w-full flex-wrap items-center gap-2.5 rounded-md [&>*>*]:text-slate-500 [&>*>*]:group-hover:text-slate-600 [&>*]:ring [&>*]:ring-slate-200 [&>*]:hover:ring-slate-300">
        {links.map(({ key, href, className, Icon, iconClassName }) => (
          <ALumniSocialLink
            key={key}
            href={href}
            Icon={Icon}
            className={className}
            iconClassName={iconClassName}
          />
        ))}
        {alumni.personalSite && (
          <ALumniSocialLink
            href={alumni.personalSite}
            Icon={WebsiteIcon}
            iconClassName="size-5.5"
          />
        )}
      </div>
    </div>
  );
}
