import os
import re

def rewrite_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)
        
    with open(filepath, 'w') as f:
        f.write(content)

# File 1: branches-admin
rewrite_file('/run/media/devoryx/Storage/tapco/dashboard/src/app/features/branches-admin/branches-admin.component.ts', [
    (r"import\s*\{\s*Dialog\s*\}\s*from\s*'primeng/dialog';\n", "import { ModalComponent } from '../../shared/components/modal/modal.component';\n"),
    (r"Dialog", "ModalComponent"),
    (r"<p-dialog([^>]*)>", lambda m: f"<app-modal{m.group(1)}>".replace('[modal]="true"', '').replace('[draggable]="false"', '').replace('[resizable]="false"', '').replace('[dismissableMask]="true"', '[dismissable]="true"').replace(r"[style]=\"{ width: '90vw', maxWidth: '600px' }\"", '')),
    (r"</p-dialog>", "</app-modal>"),
    (r'<ng-template pTemplate="footer">', '<div modal-footer>'),
    (r'</ng-template>', '</div>')
])

# File 2: certificates-admin
rewrite_file('/run/media/devoryx/Storage/tapco/dashboard/src/app/features/certificates-admin/certificates-admin.component.ts', [
    (r"import\s*\{\s*Dialog\s*\}\s*from\s*'primeng/dialog';\n", "import { ModalComponent } from '../../shared/components/modal/modal.component';\n"),
    (r"Dialog", "ModalComponent"),
    (r"<p-dialog([^>]*)>", lambda m: f"<app-modal{m.group(1)}>".replace('[modal]="true"', '').replace('[draggable]="false"', '').replace('[resizable]="false"', '').replace('[dismissableMask]="true"', '[dismissable]="true"').replace(r"[style]=\"{ width: '90vw', maxWidth: '480px' }\"", '')),
    (r"</p-dialog>", "</app-modal>"),
    (r'<ng-template pTemplate="footer">', '<div modal-footer>'),
    (r'</ng-template>', '</div>')
])

# File 6: categories-admin
rewrite_file('/run/media/devoryx/Storage/tapco/dashboard/src/app/features/categories-admin/categories-admin.component.ts', [
    (r"import\s*\{\s*Dialog\s*\}\s*from\s*'primeng/dialog';\n", "import { ModalComponent } from '../../shared/components/modal/modal.component';\n"),
    (r"import\s*\{\s*Select\s*\}\s*from\s*'primeng/select';\n", ""),
    (r"imports:\s*\[FormsModule,\s*Dialog,\s*Select,\s*AdminIconComponent\],", "imports: [FormsModule, ModalComponent, AdminIconComponent],"),
    (r"<p-dialog([^>]*)>", lambda m: f"<app-modal{m.group(1)}>".replace('[modal]="true"', '').replace('[draggable]="false"', '').replace('[resizable]="false"', '').replace('[dismissableMask]="true"', '[dismissable]="true"').replace(r"[style]=\"{ width: '90vw', maxWidth: '560px' }\"", '')),
    (r"</p-dialog>", "</app-modal>"),
    (r'<ng-template pTemplate="footer">', '<div modal-footer>'),
    (r'</ng-template>', '</div>'),
    (r'<p-select([^>]*)>', lambda m: f"""<div class="custom-select-wrap">
              <select class="form-select"{m.group(1).replace('[options]="parentCategoryOptions()"', '').replace('optionLabel="label"', '').replace('optionValue="value"', '').replace('placeholder="بدون فئة أصلية (فئة رئيسية جذرية)"', '').replace('styleClass="w-full"', '')}>
                <option [ngValue]="null">-- بدون فئة أصلية (فئة رئيسية جذرية) --</option>
                @for (opt of parentCategoryOptions(); track opt.value) {{
                  <option [ngValue]="opt.value">{{{{ opt.label }}}}</option>
                }}
              </select>
            </div>"""),
    (r'</p-select>', '')
])

# File 5: login
rewrite_file('/run/media/devoryx/Storage/tapco/dashboard/src/app/features/auth/login.component.ts', [
    (r"import\s*\{\s*Password\s*\}\s*from\s*'primeng/password';\n", "import { PasswordInputComponent } from '../../shared/components/form-password/form-password.component';\n"),
    (r"imports:\s*\[FormsModule,\s*Password,\s*AdminIconComponent\],", "imports: [FormsModule, PasswordInputComponent, AdminIconComponent],"),
    (r"<p-password([^>]*)>", lambda m: f"<app-password-input{m.group(1)}>".replace('[toggleMask]="true"', '').replace('[feedback]="false"', '').replace('styleClass="w-full"', '').replace('inputStyleClass="form-input w-full"', 'class="form-input w-full"')),
    (r"</p-password>", "</app-password-input>")
])

