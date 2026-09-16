import os
import re

def rewrite_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)
        
    with open(filepath, 'w') as f:
        f.write(content)

# File 3: users-admin
rewrite_file('/run/media/devoryx/Storage/tapco/dashboard/src/app/features/users-admin/users-admin.component.ts', [
    (r"import\s*\{\s*Dialog\s*\}\s*from\s*'primeng/dialog';\n", "import { ModalComponent } from '../../shared/components/modal/modal.component';\n"),
    (r"import\s*\{\s*Select\s*\}\s*from\s*'primeng/select';\n", ""),
    (r"import\s*\{\s*Password\s*\}\s*from\s*'primeng/password';\n", "import { PasswordInputComponent } from '../../shared/components/form-password/form-password.component';\n"),
    (r"imports:\s*\[FormsModule,\s*Dialog,\s*Select,\s*Password,\s*AdminIconComponent\],", "imports: [FormsModule, ModalComponent, PasswordInputComponent, AdminIconComponent],"),
    (r"<p-dialog([^>]*)>", lambda m: f"<app-modal{m.group(1)}>".replace('[modal]="true"', '').replace('[draggable]="false"', '').replace('[resizable]="false"', '').replace('[dismissableMask]="true"', '[dismissable]="true"').replace(r"[style]=\"{ width: '90vw', maxWidth: '480px' }\"", '')),
    (r"</p-dialog>", "</app-modal>"),
    (r'<ng-template pTemplate="footer">', '<div modal-footer>'),
    (r'</ng-template>', '</div>'),
    (r'<p-select([^>]*)>', lambda m: f"""<div class="custom-select-wrap">
              <select class="form-select"{m.group(1).replace('[options]="roleOptions()"', '').replace('optionLabel="label"', '').replace('optionValue="value"', '').replace('styleClass="w-full"', '')}>
                @for (opt of roleOptions(); track opt.value) {{
                  <option [ngValue]="opt.value">{{{{ opt.label }}}}</option>
                }}
              </select>
            </div>"""),
    (r'</p-select>', ''),
    (r"<p-password([^>]*)>", lambda m: f"<app-password-input{m.group(1)}>".replace('[toggleMask]="true"', '').replace('[feedback]="false"', '').replace('styleClass="w-full"', '').replace('inputStyleClass="form-input w-full"', 'class="form-input w-full"')),
    (r"</p-password>", "</app-password-input>")
])

# File 4: products-admin
with open('/run/media/devoryx/Storage/tapco/dashboard/src/app/features/products-admin/products-admin.component.ts', 'r') as f:
    products_content = f.read()

products_content = re.sub(r"import\s*\{\s*Dialog\s*\}\s*from\s*'primeng/dialog';\n", "import { ModalComponent } from '../../shared/components/modal/modal.component';\n", products_content)
products_content = re.sub(r"import\s*\{\s*Select\s*\}\s*from\s*'primeng/select';\n", "", products_content)
products_content = re.sub(r"imports:\s*\[FormsModule,\s*Dialog,\s*Select,\s*AdminIconComponent\],", "imports: [FormsModule, ModalComponent, AdminIconComponent],", products_content)

products_content = re.sub(r"<p-dialog([^>]*)>", lambda m: f"<app-modal{m.group(1)}>".replace('[modal]="true"', '').replace('[draggable]="false"', '').replace('[resizable]="false"', '').replace('[dismissableMask]="true"', '[dismissable]="true"').replace(r"[style]=\"{ width: '95vw', maxWidth: '840px' }\"", ''), products_content)
products_content = products_content.replace("</p-dialog>", "</app-modal>")

# Replacements for selects in products-admin
select_replacements = [
    (r'''<p-select
          \[\(ngModel\)\]="categoryFilter"
          \(onChange\)="loadProducts\(1\)"
          \[options\]="categoryFilterOptions\(\)"
          optionLabel="label"
          optionValue="value"
          placeholder="كافة الفئات"
          styleClass="filter-select"
        />''', '''<div class="custom-select-wrap">
          <select class="form-select filter-select" [(ngModel)]="categoryFilter" (change)="loadProducts(1)">
            <option [ngValue]="''">كافة الفئات</option>
            @for (opt of categoryFilterOptions(); track opt.value) {
              <option [ngValue]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>'''),

    (r'''<p-select
          \[\(ngModel\)\]="activeFilter"
          \(onChange\)="loadProducts\(1\)"
          \[options\]="activeFilterOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="كافة الحالات"
          styleClass="filter-select"
        />''', '''<div class="custom-select-wrap">
          <select class="form-select filter-select" [(ngModel)]="activeFilter" (change)="loadProducts(1)">
            <option [ngValue]="''">كافة الحالات</option>
            @for (opt of activeFilterOptions; track opt.value) {
              <option [ngValue]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>'''),

    (r'''<p-select
                  \[\(ngModel\)\]="form.category_id"
                  name="category_id"
                  \[options\]="formCategoryOptions\(\)"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="اختر الفئة"
                  styleClass="w-full"
                />''', '''<div class="custom-select-wrap">
                  <select class="form-select w-full" [(ngModel)]="form.category_id" name="category_id">
                    @for (opt of formCategoryOptions(); track opt.value) {
                      <option [ngValue]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                </div>'''),

    (r'''<p-select
                  \[\(ngModel\)\]="form.supplier_id"
                  name="supplier_id"
                  \[options\]="formSupplierOptions\(\)"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="لا يوجد مورد محدد"
                  styleClass="w-full"
                />''', '''<div class="custom-select-wrap">
                  <select class="form-select w-full" [(ngModel)]="form.supplier_id" name="supplier_id">
                    @for (opt of formSupplierOptions(); track opt.value) {
                      <option [ngValue]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                </div>'''),

    (r'''<p-select
                  \[\(ngModel\)\]="form.formulation_code"
                  name="formulation_code"
                  \[options\]="formulationCodeOptions"
                  optionLabel="label"
                  optionValue="value"
                  styleClass="w-full"
                />''', '''<div class="custom-select-wrap">
                  <select class="form-select w-full" [(ngModel)]="form.formulation_code" name="formulation_code">
                    @for (opt of formulationCodeOptions; track opt.value) {
                      <option [ngValue]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                </div>'''),

    (r'''<p-select
                  \[\(ngModel\)\]="form.toxicity_class"
                  name="toxicity_class"
                  \[options\]="toxicityOptions"
                  optionLabel="label"
                  optionValue="value"
                  styleClass="w-full"
                />''', '''<div class="custom-select-wrap">
                  <select class="form-select w-full" [(ngModel)]="form.toxicity_class" name="toxicity_class">
                    @for (opt of toxicityOptions; track opt.value) {
                      <option [ngValue]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                </div>''')
]

for pat, repl in select_replacements:
    products_content = re.sub(pat, repl, products_content)

with open('/run/media/devoryx/Storage/tapco/dashboard/src/app/features/products-admin/products-admin.component.ts', 'w') as f:
    f.write(products_content)

# File 11: website products-list
with open('/run/media/devoryx/Storage/tapco/website/src/app/features/products/products-list.component.ts', 'r') as f:
    website_content = f.read()

website_content = re.sub(r"import\s*\{\s*Select\s*\}\s*from\s*'primeng/select';\n", "", website_content)
website_content = website_content.replace("imports: [FormsModule, Select, ProductCardComponent, IconComponent],", "imports: [FormsModule, ProductCardComponent, IconComponent],")

selects_replacements_website = [
    (r'''<p-select
                    \[\(ngModel\)\]="selectedCrop"
                    \[options\]="cropOptions\(\)"
                    optionLabel="label"
                    optionValue="value"
                    \(onChange\)="applyFilters\(\)"
                    styleClass="w-full filter-p-select"
                  />''', '''<div class="custom-select-wrap">
                    <select class="form-select w-full" [(ngModel)]="selectedCrop" (change)="applyFilters()">
                      @for (opt of cropOptions(); track opt.value) {
                        <option [ngValue]="opt.value">{{ opt.label }}</option>
                      }
                    </select>
                  </div>'''),

    (r'''<p-select
                    \[\(ngModel\)\]="selectedPest"
                    \[options\]="pestOptions\(\)"
                    optionLabel="label"
                    optionValue="value"
                    \(onChange\)="applyFilters\(\)"
                    styleClass="w-full filter-p-select"
                  />''', '''<div class="custom-select-wrap">
                    <select class="form-select w-full" [(ngModel)]="selectedPest" (change)="applyFilters()">
                      @for (opt of pestOptions(); track opt.value) {
                        <option [ngValue]="opt.value">{{ opt.label }}</option>
                      }
                    </select>
                  </div>'''),

    (r'''<p-select
                    \[\(ngModel\)\]="selectedSupplier"
                    \[options\]="supplierOptions\(\)"
                    optionLabel="label"
                    optionValue="value"
                    \(onChange\)="applyFilters\(\)"
                    styleClass="w-full filter-p-select"
                  />''', '''<div class="custom-select-wrap">
                    <select class="form-select w-full" [(ngModel)]="selectedSupplier" (change)="applyFilters()">
                      @for (opt of supplierOptions(); track opt.value) {
                        <option [ngValue]="opt.value">{{ opt.label }}</option>
                      }
                    </select>
                  </div>'''),

    (r'''<p-select
                    \[\(ngModel\)\]="sortBy"
                    \[options\]="sortOptions\(\)"
                    optionLabel="label"
                    optionValue="value"
                    \(onChange\)="applyFilters\(\)"
                    styleClass="sort-p-select"
                  />''', '''<div class="custom-select-wrap sort-select-wrap">
                    <select class="form-select sort-select" [(ngModel)]="sortBy" (change)="applyFilters()">
                      @for (opt of sortOptions(); track opt.value) {
                        <option [ngValue]="opt.value">{{ opt.label }}</option>
                      }
                    </select>
                  </div>''')
]

for pat, repl in selects_replacements_website:
    website_content = re.sub(pat, repl, website_content)

# add css
website_css = '''
    .custom-select-wrap { position: relative; }
    .form-select { width: 100%; padding: 0.55rem 2.25rem 0.55rem 0.75rem; border: 1px solid var(--tapco-border); border-radius: var(--radius-sm); background: #fff; font-size: 0.9rem; color: var(--tapco-text-main); appearance: none; -webkit-appearance: none; cursor: pointer; line-height: 1.4; }
    .form-select:focus { outline: none; border-color: var(--tapco-green-600); box-shadow: 0 0 0 3px rgba(18,67,54,0.12); }
    .custom-select-wrap::after { content: ''; position: absolute; inset-inline-end: 0.75rem; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid #53645e; pointer-events: none; }
    .sort-select-wrap { display: inline-block; width: auto; }
'''
website_content = website_content.replace('  styles: [`', '  styles: [`' + website_css)

with open('/run/media/devoryx/Storage/tapco/website/src/app/features/products/products-list.component.ts', 'w') as f:
    f.write(website_content)
