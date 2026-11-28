# Putting the website on Bluehost

## 1. Build the upload file (on the development computer)
```bash
nvm use
SITE_URL=https://www.yourdomain.com npm run package                 # hidden preview (search engines blocked)
SITE_URL=https://www.yourdomain.com npm run package -- --production # real launch
```
This creates **nanofab-bluehost.zip**.

## 2. Upload (Bluehost cPanel)
1. Turn on SSL for the domain (Bluehost provides a free certificate).
2. **MultiPHP Manager:** select PHP **8.1 or newer**. Under PHP extensions, `gd` and `mbstring` must be on (they normally are).
3. **File Manager → public_html:** back up anything already there, upload the zip, and **Extract** it into `public_html`.
   Turn on "Show hidden files" and check `.htaccess` is present.

## 3. One-time setup
1. In `public_html/private`, copy `config.sample.php` to `config.php`.
2. Edit it: set `setup_key` to your own long random text, and `from_email` to a mailbox you create in cPanel
   (for example `no-reply@yourdomain.com`).
3. Open `https://www.yourdomain.com/admin/`, enter the setup key and choose a dashboard password.
4. **Settings → Email notifications:** enter the inbox that should receive enquiries and visitor emails.
5. Send a test enquiry from the Contact page. If the email lands in spam, check **Email Deliverability** (SPF/DKIM) in cPanel.

## Using the dashboard (/admin/)
| Tab | What you can do |
|---|---|
| Scrolling banners | Upload an image with headline, bullets and button; reorder, edit, delete; hide the original banners |
| Products | Upload product image, name, category and description. They appear on the Products page |
| Enquiries & emails | Read contact/BOM submissions and visitor emails, download attachments, export CSV, delete |
| Settings | Notification email, password |

Changes show on the website immediately. Upload only images you have the right to use.

## Updating the website later
Build a new zip and extract it over `public_html`. Your password, banners, products, enquiries and uploaded images are
**kept**: the zip does not contain `private/config.php`, `private/data/` or uploaded files.

## Backups and privacy
Back up `public_html/private` and `public_html/uploads` regularly (cPanel → Backup). `private/data` holds personal
data from visitors: delete what you no longer need and honour deletion requests.

## Forgotten password
Delete `private/data/admin.json` in File Manager, then run the setup at `/admin/` again with your setup key.
