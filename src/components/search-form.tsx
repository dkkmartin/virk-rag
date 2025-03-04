import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/ui/sidebar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCVRStore } from '@/lib/store';
import { Root } from '@/types/virk-response';

type Input = {
  search: string;
};

export function SearchForm({ ...props }: React.ComponentProps<'form'>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const responses = useCVRStore((state) => state.responses);
  const addResponse = useCVRStore((state) => state.addResponse);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    // Check if CVR already exists in store
    const existingResponse = responses.find(
      (response) => response.data.stamdata?.cvrnummer === data.search
    );

    if (existingResponse) {
      // Move to top of list if needed
      addResponse(existingResponse);
      return;
    }

    try {
      const response = await fetch(`/api/cvr/${data.search}`);
      if (!response.ok) {
        throw new Error('Failed to fetch CVR data');
      }
      const responseData = await response.json();
      if (responseData && responseData.data?.stamdata?.cvrnummer) {
        addResponse(responseData as Root);
      }
    } catch (error) {
      console.error('Error fetching CVR:', error);
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="CVR..."
            className="pl-8"
            {...register('search', { required: 'Please enter a CVR number' })}
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
      {errors.search && <p className="text-red-500">{errors.search.message}</p>}
    </form>
  );
}
