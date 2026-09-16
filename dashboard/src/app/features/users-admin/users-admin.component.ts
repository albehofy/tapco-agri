import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { PasswordInputComponent } from '../../shared/components/form-password/form-password.component';
import { AdminApiService } from '../../core/services/admin-api.service';
import { AdminUser, Role } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [FormsModule, ModalComponent, PasswordInputComponent, AdminIconComponent],
  template: `
    <div class="users-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة المستخدمين وصلاحيات لوحة التحكم</h1>
          <p class="page-desc">إدارة حسابات مسؤولي النظام، مشرفي المنتجات، وتحديد أدوار الدخول والصلاحيات</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل المستخدمين...</p>
        </div>
      } @else {
        <div class="table-wrap card-base">
          <table class="admin-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>البريد الإلكتروني</th>
                <th>الدور والصلاحية</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr>
                  <td>
                    <div class="user-row-info">
                      <div class="avatar-cell">
                        {{ user.name.substring(0, 1) }}
                      </div>
                      <strong>{{ user.name }}</strong>
                    </div>
                  </td>
                  <td dir="ltr" class="ltr-cell">{{ user.email }}</td>
                  <td>
                    <span class="role-badge" [class.admin-role]="getRoleName(user) === 'Admin'">
                      <app-admin-icon name="shield" [size]="14" />
                      <span>{{ getRoleName(user) }}</span>
                    </span>
                  </td>
                  <td>
                    <span class="badge" [class.badge-green]="user.is_active !== false" [class.badge-gray]="user.is_active === false">
                      {{ user.is_active !== false ? 'مفعل' : 'معطل' }}
                    </span>
                  </td>
                  <td>
                    <div class="row-actions">
                      <button class="btn btn-outline btn-sm" (click)="openEditModal(user)" title="تعديل">
                        <app-admin-icon name="edit" [size]="14" />
                        <span>تعديل</span>
                      </button>
                      <button class="icon-btn-sm delete" (click)="confirmDelete(user)" title="حذف">
                        <app-admin-icon name="trash" [size]="14" />
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- PrimeNG Dialog -->
      <app-modal
        [visible]="showModal()"
        (visibleChange)="showModal.set($event)"
        
        [header]="modalMode() === 'create' ? 'إضافة مستخدم جديد' : 'تعديل بيانات المستخدم'"
        [style]="{ width: '90vw', maxWidth: '480px' }"
        
        
        [dismissable]="true"
      >
        <div class="dialog-content-body pt-2">
          <div class="form-group">
            <label>الاسم بالكامل <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name" class="form-input" placeholder="اسم المسؤول" />
          </div>

          <div class="form-group">
            <label>البريد الإلكتروني <span class="req">*</span></label>
            <input type="email" [(ngModel)]="formData.email" class="form-input" dir="ltr" placeholder="admin@tapco-agri.com" />
          </div>

          <div class="form-group">
            <label>
              كلمة المرور
              @if (modalMode() === 'edit') {
                <span class="text-muted">(اتركها فارغة إذا لم ترغب بتغييرها)</span>
              } @else {
                <span class="req">*</span>
              }
            </label>
            <app-password-input
              [(ngModel)]="formData.password"
              
              
              
              class="form-input w-full"
              dir="ltr"
              placeholder="••••••••"
            />
          </div>

          <div class="form-group">
            <label>الدور الوظيفي <span class="req">*</span></label>
            <div class="custom-select-wrap">
              <select class="form-select" [(ngModel)]="formData.role_id">
                @for (opt of roleOptions(); track opt.value) {
                  <option [ngValue]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="formData.is_active" />
              <span>الحساب نشط ويمكنه الدخول</span>
            </label>
          </div>

          @if (errorMessage()) {
            <div class="alert alert-danger mt-3">{{ errorMessage() }}</div>
          }
        </div>

        <div modal-footer>
          <button class="btn btn-outline" (click)="closeModal()">إلغاء</button>
          <button class="btn btn-primary" [disabled]="isSubmitting()" (click)="saveUser()">
            @if (isSubmitting()) {
              <div class="spinner-sm"></div>
              <span>جاري الحفظ...</span>
            } @else {
              <span>حفظ البيانات</span>
            }
          </button>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    .users-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .user-row-info { display: flex; align-items: center; gap: 0.75rem; }
    .avatar-cell {
      width: 34px; height: 34px; border-radius: 50%; background: var(--admin-green-100);
      color: var(--admin-green-800); font-weight: 700; display: flex; align-items: center; justify-content: center;
    }

    .ltr-cell { text-align: right; }

    .role-badge {
      display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; border-radius: var(--radius-full);
      font-size: 0.8rem; font-weight: 700; background: #e0f2fe; color: #0369a1;
      &.admin-role { background: #fef3c7; color: #92400e; }
    }

    .row-actions { display: flex; align-items: center; gap: 0.5rem; }
    .icon-btn-sm {
      background: none; border: none; padding: 0.35rem; border-radius: var(--radius-sm); cursor: pointer; color: var(--admin-text-muted);
      &.delete:hover { color: #ef4444; background: #fef2f2; }
    }

    .dialog-content-body { display: flex; flex-direction: column; gap: 1rem; }

    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
      .req { color: #ef4444; }
      .text-muted { color: var(--admin-text-muted); font-size: 0.75rem; font-weight: normal; }
    }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }

    .loading-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .w-full { width: 100%; }
  `]
})
export class UsersAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly users = signal<AdminUser[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly roleOptions = computed(() => {
    return this.roles().map((r) => ({ label: r.name, value: r.id }));
  });

  formData = {
    name: '',
    email: '',
    password: '',
    role_id: 1,
    is_active: true
  };

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles(): void {
    this.api.getRoles().subscribe({
      next: (res) => this.roles.set(res.data || [])
    });
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.api.getUsers().subscribe({
      next: (res) => {
        this.users.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getRoleName(user: AdminUser): string {
    if (typeof user.role === 'object' && user.role !== null) {
      return (user.role as Role).name;
    }
    return (user.role as string) || 'Admin';
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingId.set(null);
    this.formData = {
      name: '',
      email: '',
      password: '',
      role_id: this.roles().length > 0 ? this.roles()[0].id : 1,
      is_active: true
    };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  openEditModal(user: AdminUser): void {
    this.modalMode.set('edit');
    this.editingId.set(user.id);
    let roleId = user.role_id || 1;
    if (typeof user.role === 'object' && user.role) {
      roleId = (user.role as Role).id;
    }

    this.formData = {
      name: user.name,
      email: user.email,
      password: '',
      role_id: roleId,
      is_active: user.is_active !== false
    };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveUser(): void {
    if (!this.formData.name || !this.formData.email) {
      this.errorMessage.set('يرجى كتابة الاسم والبريد الإلكتروني');
      return;
    }

    if (this.modalMode() === 'create' && (!this.formData.password || this.formData.password.length < 6)) {
      this.errorMessage.set('كلمة المرور يجب ألا تقل عن 6 خانات');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload: any = {
      name: this.formData.name,
      email: this.formData.email,
      role_id: this.formData.role_id,
      is_active: this.formData.is_active
    };
    if (this.formData.password) {
      payload.password = this.formData.password;
    }

    const req$ = this.modalMode() === 'create'
      ? this.api.createUser(payload)
      : this.api.updateUser(this.editingId()!, payload);

    req$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ المستخدم');
      }
    });
  }

  confirmDelete(user: AdminUser): void {
    if (confirm(`هل أنت متأكد من حذف حساب "${user.name}"؟`)) {
      this.api.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => alert(err.error?.message || 'تعذر حذف المستخدم')
      });
    }
  }
}
