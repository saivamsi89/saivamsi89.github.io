import subprocess, urllib.request, urllib.error
from playwright.sync_api import sync_playwright, expect
B = 'http://localhost:8719'
IMG = 'src/assets/hero/pcb-assembly.jpg'
results = []
def check(name, cond):
    results.append(bool(cond)); print(('PASS ' if cond else 'FAIL ') + name)
def status(path, data=None, headers={}):
    try: return urllib.request.urlopen(urllib.request.Request(B + path, data=data, headers=headers)).status
    except urllib.error.HTTPError as e: return e.code
def mail(): return subprocess.run(['docker','exec','nf-bluehost','sh','-c','cat /tmp/mail.txt 2>/dev/null'],capture_output=True,text=True,errors='replace').stdout

with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    errs = []
    adm = br.new_page(viewport={'width':1280,'height':900}); adm.on('pageerror', lambda e: errs.append(str(e)))
    adm.goto(B + '/admin/')
    adm.fill('[name=setup_key]','wrong'); adm.fill('[name=password]','correct-horse-battery'); adm.fill('[name=password2]','correct-horse-battery'); adm.click('button.primary')
    check('setup rejects a wrong key', 'not correct' in adm.inner_text('.msg'))
    adm.fill('[name=setup_key]','test-setup-key-123'); adm.fill('[name=password]','correct-horse-battery'); adm.fill('[name=password2]','correct-horse-battery'); adm.click('button.primary')
    adm.fill('[name=password]','nope'); adm.click('button.primary'); check('wrong password rejected', 'Wrong password' in adm.inner_text('.msg'))
    adm.fill('[name=password]','correct-horse-battery'); adm.click('button.primary'); adm.wait_for_selector('nav'); check('signed in', adm.is_visible('nav'))
    adm.goto(B+'/admin/?tab=settings'); adm.fill('[name=notify_email]','owner@example.com'); adm.locator('button', has_text='Save').first.click()
    check('notify email saved', 'Saved' in adm.inner_text('.msg'))

    def add_banner(title, link='/products'):
        adm.goto(B+'/admin/?tab=banners'); f = adm.locator('form.grid').first
        f.locator('[name=image]').set_input_files(IMG); f.locator('[name=title]').fill(title); f.locator('[name=accent]').fill('From the dashboard')
        f.locator('[name=bullets]').fill('First point\nSecond <img src=x onerror=alert(1)>'); f.locator('[name=buttonLink]').fill(link); f.locator('button.primary').click()
        return adm.inner_text('.msg')
    check('javascript: link rejected', 'must start with' in add_banner('Bad', 'javascript:alert(1)'))
    adm.goto(B+'/admin/?tab=banners'); f=adm.locator('form.grid').first
    f.locator('[name=image]').set_input_files({'name':'x.jpg','mimeType':'image/jpeg','buffer':b'<?php echo 1; ?>'}); f.locator('[name=title]').fill('Fake'); f.locator('button.primary').click()
    check('fake image rejected', 'JPG, PNG or WebP' in adm.inner_text('.msg'))
    check('banner added', 'Saved' in add_banner('New Launch Banner'))
    adm.goto(B+'/admin/?tab=products'); f=adm.locator('form.grid').first
    f.locator('[name=image]').set_input_files(IMG); f.locator('[name=name]').fill('NF Sensor Node'); f.locator('[name=category]').fill('IoT'); f.locator('[name=description]').fill('Battery powered node.'); f.locator('button.primary').click()
    check('product added', 'Saved' in adm.inner_text('.msg'))

    pg = br.new_page(viewport={'width':1440,'height':800}); pg.on('pageerror', lambda e: errs.append(str(e)))
    dialogs=[]; pg.on('dialog', lambda d:(dialogs.append(d.message), d.dismiss()))
    pg.goto(B+'/', wait_until='networkidle')
    check('banner appears with the originals (6 slides, 6 lines)', pg.locator('.slide:not([data-clone])').count()==6 and pg.locator('.hero-tab').count()==6)
    check('cookie banner shown with optional email', pg.is_visible('#consent-email'))
    pg.fill('#consent-email','bad'); pg.click('[data-consent=granted]'); check('invalid email blocked', pg.is_visible('.consent-error'))
    pg.fill('#consent-email','visitor@example.com'); pg.click('[data-consent=granted]'); pg.wait_for_timeout(1200)
    pg.locator('.hero-tab[data-go="5"]').hover(); pg.wait_for_timeout(1500)
    s = pg.locator('.slide[data-slide="5"]:not([data-clone])')
    check('hover shows the new banner', 'is-active' in s.get_attribute('class') and 'New Launch Banner' in s.inner_text())
    check('banner image loads', s.locator('.slide-photo img').evaluate('i=>i.complete && i.naturalWidth>0'))
    check('button link used', s.locator('a.d-cta').get_attribute('href')=='/products')
    check('typed HTML stays plain text', s.locator('li img').count()==0 and not dialogs)
    check('exactly one h1', pg.locator('h1').count()==1)
    pg.screenshot(path='/tmp/nf-bh-home.png')
    pg.goto(B+'/products/', wait_until='networkidle')
    check('product shown with name and image', pg.locator('#dyn-products h3').inner_text()=='NF Sensor Node' and pg.locator('#dyn-products img').evaluate('i=>i.naturalWidth>0'))
    pg.locator('#dyn-products').screenshot(path='/tmp/nf-bh-products.png')
    pg.locator('#dyn-products a.p-cta').click(); pg.wait_for_load_state('networkidle')
    check('enquiry pre-filled', 'NF Sensor Node' in pg.input_value('textarea[name=message]'))
    pg.fill('input[name=name]','Test Buyer'); pg.fill('input[name=email]','buyer@example.com'); pg.fill('input[name=country]','India')
    pg.set_input_files('input[type=file]', {'name':'bom.csv','mimeType':'text/csv','buffer':b'part,qty\nR1,2\n'}); pg.check('input[name=consent]'); pg.locator('.enquiry-form button[type=submit]').click()
    expect(pg.locator('.form-status')).to_contain_text('received'); check('contact form delivered', True)
    m = mail()
    check('email notifications sent for visitor and enquiry', 'owner@example.com' in m and 'Reply-To: visitor@example.com' in m and 'Reply-To: buyer@example.com' in m and 'filename="bom.csv"' in m)
    adm.goto(B+'/admin/?tab=enquiries'); t=adm.inner_text('main')
    check('dashboard lists visitor and buyer emails', 'visitor@example.com' in t and 'buyer@example.com' in t)
    with adm.expect_download() as d: adm.click('text=Download bom.csv')
    check('attachment downloads', open(d.value.path(),'rb').read().startswith(b'part,qty'))
    dl = adm.locator('a[href^="?download="]').get_attribute('href')
    adm.screenshot(path='/tmp/nf-bh-admin.png', full_page=True)

    check('private folder blocked', status('/private/data/admin.json')==403 and status('/private/config.php')==403 and status('/private/data/submissions.json')==403)
    anon = br.new_context().new_page(); anon.goto(B+'/admin/'+dl); check('download needs sign-in', 'Sign in' in anon.inner_text('body'))
    check('post without CSRF token changes nothing', status('/admin/', b'action=builtin', {'Content-Type':'application/x-www-form-urlencoded'}) in (200,302) and pg.request.get(B+'/api/content.php').json()['showBuiltinSlides'] is True)
    check('foreign origin refused', status('/api/submit.php', b'form=Contact+Enquiry', {'Origin':'https://evil.example','Content-Type':'application/x-www-form-urlencoded'})==403)
    subprocess.run(['docker','exec','nf-bluehost','sh','-c','echo "<?php echo 1;" > /var/www/html/uploads/x.php'],check=True)
    check('scripts in uploads blocked', status('/uploads/x.php')==403)
    check('missing page is 404', status('/nope')==404)
    adm.goto(B+'/admin/?tab=banners'); adm.uncheck('[name=show]'); adm.locator('button', has_text='Save').filter(has_not_text='changes').first.click()
    pg.goto(B+'/', wait_until='networkidle'); check('originals can be switched off', pg.locator('.slide:not([data-clone])').count()==1 and pg.locator('h1').inner_text().startswith('New Launch'))
    adm.goto(B+'/admin/?tab=banners'); adm.locator('summary', has_text='Delete').click(); adm.click('text=Yes, delete')
    pg.goto(B+'/', wait_until='networkidle'); check('deleting restores the originals', pg.locator('.slide:not([data-clone])').count()==5)
    check('no script errors', not errs); 
    if errs: print(errs)
    br.close()
print(f'{sum(results)}/{len(results)} checks passed'); raise SystemExit(0 if all(results) else 1)
